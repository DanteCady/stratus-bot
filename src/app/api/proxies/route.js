import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req) {
	try {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const groupId = searchParams.get('groupId');

		if (!groupId) {
			return NextResponse.json(
				{ error: 'Group ID is required' },
				{ status: 400 }
			);
		}

		const proxies = await queryDatabase(
			`SELECT id, address, status FROM proxies 
             WHERE proxy_group_id = ? AND user_id = ?`,
			[groupId, token.sub]
		);

		return NextResponse.json({ proxies });
	} catch (error) {
		console.error('❌ Error fetching proxies:', error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

export async function POST(req) {
	try {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { proxyGroupId, proxies } = await req.json();

		if (!proxyGroupId || !proxies || !proxies.length) {
			return NextResponse.json(
				{ error: 'Invalid request data' },
				{ status: 400 }
			);
		}

		// Validate group ownership
		const [group] = await queryDatabase(
			'SELECT id FROM proxy_groups WHERE id = ? AND user_id = ?',
			[proxyGroupId, token.sub]
		);

		if (!group) {
			return NextResponse.json(
				{ error: 'Proxy group not found' },
				{ status: 404 }
			);
		}

		// Generate IDs first
		const proxyEntries = proxies.map((proxy) => ({
			id: uuidv4(),
			address: proxy.trim(),
		}));

		// Create the VALUES part of the query dynamically
		const placeholders = proxyEntries
			.map(() => '(?, ?, ?, ?, ?, NOW())')
			.join(', ');
		const values = proxyEntries.flatMap((proxy) => [
			proxy.id,
			token.sub,
			proxyGroupId,
			proxy.address,
			'Untested',
		]);

		// Insert all proxies with a single query
		await queryDatabase(
			`INSERT INTO proxies (id, user_id, proxy_group_id, address, status, created_at) 
             VALUES ${placeholders}`,
			values
		);

		return NextResponse.json(
			{
				message: 'Proxies added successfully',
				proxies: proxyEntries.map((proxy) => ({
					id: proxy.id,
					address: proxy.address,
					status: 'Untested',
				})),
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('❌ Error adding proxies:', error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
