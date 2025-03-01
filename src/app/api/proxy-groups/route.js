import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
	try {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { name } = await req.json();
		if (!name) {
			return NextResponse.json(
				{ error: 'Proxy group name is required' },
				{ status: 400 }
			);
		}

		// Check if user already has a "Default" group
		const existingDefaultGroup = await queryDatabase(
			`SELECT proxy_group_id FROM proxy_groups WHERE user_id = ? AND name = 'Default'`,
			[token.sub]
		);

		if (!existingDefaultGroup.length && name === 'Default') {
			const defaultGroupId = uuidv4();
			await queryDatabase(
				`INSERT INTO proxy_groups (proxy_group_id, user_id, name, is_default, created_at) VALUES (?, ?, ?, 1, NOW())`,
				[defaultGroupId, token.sub, 'Default']
			);
			return NextResponse.json(
				{
					message: 'Default proxy group created',
					proxyGroupId: defaultGroupId,
				},
				{ status: 201 }
			);
		}

		// Create new proxy group
		const proxyGroupId = uuidv4();
		await queryDatabase(
			`INSERT INTO proxy_groups (proxy_group_id, user_id, name, is_default, created_at) VALUES (?, ?, ?, 0, NOW())`,
			[proxyGroupId, token.sub, name]
		);

		return NextResponse.json(
			{ message: 'Proxy group created successfully', proxyGroupId },
			{ status: 201 }
		);
	} catch (error) {
		console.error('❌ [500] Proxy group creation error:', error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

export async function GET(req) {
	try {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = token.sub;

		// Fetch existing proxy groups
		const existingGroups = await queryDatabase(
			`SELECT proxy_group_id, name, is_default FROM proxy_groups WHERE user_id = ?`,
			[userId]
		);

		let defaultGroup = existingGroups.find((group) => group.name === 'Default');

		// If no Default group exists, create it automatically
		if (!defaultGroup) {
			const defaultGroupId = uuidv4();
			await queryDatabase(
				`INSERT INTO proxy_groups (proxy_group_id, user_id, name, is_default, created_at) VALUES (?, ?, 'Default', 1, NOW())`,
				[defaultGroupId, userId]
			);

			// Re-fetch the updated list
			const updatedGroups = await queryDatabase(
				`SELECT proxy_group_id, name, is_default FROM proxy_groups WHERE user_id = ?`,
				[userId]
			);

			return NextResponse.json({ proxyGroups: updatedGroups }, { status: 200 });
		}

		return NextResponse.json({ proxyGroups: existingGroups }, { status: 200 });
	} catch (error) {
		console.error('❌ [500] Fetching proxy groups error:', error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
