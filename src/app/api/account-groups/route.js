import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Fetch account groups
export async function GET(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = session.user.id;

		// Fetch existing account groups
		const accountGroups = await queryDatabase(
			'SELECT account_group_id, user_id, name, is_default, created_at FROM account_groups WHERE user_id = ?',
			[userId]
		);

		// If no groups exist, create a default group
		if (accountGroups.length === 0) {
			const defaultGroupId = uuidv4();
			await queryDatabase(
				'INSERT INTO account_groups (account_group_id, user_id, name, is_default, created_at) VALUES (?, ?, "Default", 1, NOW())',
				[defaultGroupId, userId]
			);

			// Fetch the newly created default group
			const newGroups = await queryDatabase(
				'SELECT account_group_id, user_id, name, is_default, created_at FROM account_groups WHERE user_id = ?',
				[userId]
			);
			return NextResponse.json({ accountGroups: newGroups });
		}

		return NextResponse.json({ accountGroups });
	} catch (error) {
		console.error('❌ Error fetching account groups:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch account groups' },
			{ status: 500 }
		);
	}
}

// Create a new account group
export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { name } = await req.json();
		const userId = session.user.id;
		const accountGroupId = uuidv4(); 

		await queryDatabase(
			'INSERT INTO account_groups (account_group_id, user_id, name, is_default, created_at) VALUES (?, ?, ?, 0, NOW())',
			[accountGroupId, userId, name]
		);

		return NextResponse.json({ account_group_id: accountGroupId });
	} catch (error) {
		console.error('❌ Error creating account group:', error);
		return NextResponse.json(
			{ error: 'Failed to create account group' },
			{ status: 500 }
		);
	}
}
