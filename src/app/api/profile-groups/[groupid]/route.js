import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';

export async function DELETE(req, context) {
	try {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const groupId = context.params?.groupId;

		if (!groupId) {
			return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
		}

		// Check if the profile group is the Default group
		const group = await queryDatabase(
			'SELECT is_default FROM profile_groups WHERE profile_group_id = ? AND user_id = ? LIMIT 1',
			[groupId, token.sub]
		);

		if (!group.length) {
			return NextResponse.json({ error: 'Profile group not found' }, { status: 404 });
		}

		if (group[0].is_default) {
			return NextResponse.json({ error: 'Default profile group cannot be deleted' }, { status: 400 });
		}

		// Delete associated profiles first (to maintain integrity)
		await queryDatabase('DELETE FROM profiles WHERE profile_group_id = ?', [groupId]);

		// Delete the profile group
		await queryDatabase('DELETE FROM profile_groups WHERE profile_group_id = ?', [groupId]);

		return NextResponse.json({ message: 'Profile group deleted successfully' }, { status: 200 });
	} catch (error) {
		console.error('❌ Error deleting profile group:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PUT(req, context) {
	try {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const groupId = context.params?.groupId;
		const { name } = await req.json();

		if (!groupId || !name) {
			return NextResponse.json({ error: 'Profile group name is required' }, { status: 400 });
		}

		await queryDatabase(
			`UPDATE profile_groups SET name = ? WHERE profile_group_id = ? AND user_id = ?`,
			[name, groupId, token.sub]
		);

		return NextResponse.json({ message: 'Profile group renamed successfully' }, { status: 200 });
	} catch (error) {
		console.error('❌ Error renaming profile group:', error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
