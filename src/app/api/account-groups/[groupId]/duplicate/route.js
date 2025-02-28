import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const groupId = params.groupId;
		const userId = session.user.id;
		const newGroupId = uuidv4();

		// Get the original group
		const [originalGroup] = await queryDatabase(
			'SELECT * FROM account_groups WHERE id = ? AND user_id = ?',
			[groupId, userId]
		);

		if (!originalGroup) {
			return NextResponse.json({ error: 'Group not found' }, { status: 404 });
		}

		// Create new group with copied name
		await queryDatabase(
			'INSERT INTO account_groups (id, user_id, name, is_default, created_at) VALUES (?, ?, ?, 0, NOW())',
			[newGroupId, userId, `${originalGroup.name} (Copy)`]
		);

		// Copy all accounts from the original group
		const accounts = await queryDatabase(
			'SELECT * FROM accounts WHERE account_group_id = ?',
			[groupId]
		);

		for (const account of accounts) {
			await queryDatabase(
				'INSERT INTO accounts (id, user_id, account_group_id, site, email, password, status, proxy, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
				[
					uuidv4(),
					userId,
					newGroupId,
					account.site,
					account.email,
					account.password,
					account.status,
					account.proxy,
				]
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error duplicating account group:', error);
		return NextResponse.json(
			{ error: 'Failed to duplicate group' },
			{ status: 500 }
		);
	}
}
