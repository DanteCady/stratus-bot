import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Fetch accounts for a given group
export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const groupId = searchParams.get('groupId');

		const accounts = await queryDatabase(
			'SELECT * FROM accounts WHERE account_group_id = ?',
			[groupId]
		);
		return NextResponse.json({ accounts });
	} catch (error) {
		console.error('❌ Error fetching accounts:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch accounts' },
			{ status: 500 }
		);
	}
}

// Create a new account inside a group
export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { account_group_id, site, email, password, proxy, status } =
			await req.json();
		const accountId = uuidv4();
		const userId = session.user.id;

		await queryDatabase(
			'INSERT INTO accounts (id, user_id, account_group_id, site, email, password, status, proxy, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
			[
				accountId,
				userId,
				account_group_id,
				site,
				email,
				password,
				status || 'pending',
				proxy || null,
			]
		);

		return NextResponse.json({ accountId });
	} catch (error) {
		console.error('❌ Error creating account:', error);
		return NextResponse.json(
			{ error: 'Failed to create account' },
			{ status: 500 }
		);
	}
}
