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
		const proxy_group_id = searchParams.get('groupId');

		if (!proxy_group_id) {
			return NextResponse.json(
				{ error: 'Proxy Group ID is required' },
				{ status: 400 }
			);
		}

		// Fetch proxies based on proxy_group_id and user_id
		const proxies = await queryDatabase(
			`SELECT proxy_id, address, status 
             FROM proxies 
             WHERE proxy_group_id = ? AND user_id = ?`,
			[proxy_group_id, token.sub]
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

		const { proxy_group_id, proxies } = await req.json();

		if (!proxy_group_id || !proxies || !proxies.length) {
			return NextResponse.json(
				{ error: 'Invalid request data' },
				{ status: 400 }
			);
		}

		// Validate that the proxy group belongs to the user
		const group = await queryDatabase(
			'SELECT proxy_group_id FROM proxy_groups WHERE proxy_group_id = ? AND user_id = ?',
			[proxy_group_id, token.sub]
		);

		if (!group.length) {
			return NextResponse.json(
				{ error: 'Proxy group not found' },
				{ status: 404 }
			);
		}

		// Generate UUIDs for each proxy
		const proxyEntries = proxies.map((proxy) => ({
			proxy_id: uuidv4(),
			address: proxy.trim(),
		}));

		// Construct query placeholders
		const placeholders = proxyEntries.map(() => '(?, ?, ?, ?, ?, NOW())').join(', ');
		const values = proxyEntries.flatMap((proxy) => [
			proxy.proxy_id,
			token.sub,
			proxy_group_id,
			proxy.address,
			'Untested',
		]);

		// Insert all proxies into database
		await queryDatabase(
			`INSERT INTO proxies (proxy_id, user_id, proxy_group_id, address, status, created_at) 
             VALUES ${placeholders}`,
			values
		);

		return NextResponse.json(
			{
				message: 'Proxies added successfully',
				proxies: proxyEntries.map((proxy) => ({
					proxy_id: proxy.proxy_id,
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
