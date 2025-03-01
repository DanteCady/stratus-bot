import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req, context) {
	try {
		// Authenticate user
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Extract groupId from URL params
		const groupId = context.params?.groupId;
		if (!groupId) {
			return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
		}

		// Fetch the existing profile group
		const existingGroup = await queryDatabase(
			'SELECT * FROM profile_groups WHERE profile_group_id = ? AND user_id = ? LIMIT 1',
			[groupId, token.sub]
		);

		if (!existingGroup.length) {
			return NextResponse.json({ error: 'Profile group not found' }, { status: 404 });
		}

		const { user_id, name } = existingGroup[0];

		// Generate a unique name for the duplicate
		let newGroupName = `${name} (Copy)`;

		// Prevent duplicate name conflicts
		const existingCopies = await queryDatabase(
			`SELECT name FROM profile_groups WHERE user_id = ? AND name LIKE ?`,
			[user_id, `${name} (Copy)%`]
		);

		if (existingCopies.length) {
			newGroupName = `${name} (Copy ${existingCopies.length + 1})`;
		}

		// Create a new profile group
		const newGroupId = uuidv4();
		await queryDatabase(
			'INSERT INTO profile_groups (profile_group_id, user_id, name, is_default, created_at) VALUES (?, ?, ?, 0, NOW())',
			[newGroupId, user_id, newGroupName]
		);

		// Duplicate profiles under this group
		const profiles = await queryDatabase(
			'SELECT * FROM profiles WHERE profile_group_id = ?',
			[groupId]
		);

		for (const profile of profiles) {
			await queryDatabase(
				`INSERT INTO profiles (
					profile_id, user_id, profile_group_id, profile_name, first_name, 
					last_name, email, phone, address, address2, country, state, city, 
					zipcode, cardholder, card_number, exp_month, exp_year, cvv, created_at
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
				[
					uuidv4(),
					user_id,
					newGroupId,
					profile.profile_name,
					profile.first_name,
					profile.last_name,
					profile.email,
					profile.phone,
					profile.address,
					profile.address2,
					profile.country,
					profile.state,
					profile.city,
					profile.zipcode,
					profile.cardholder,
					profile.card_number,
					profile.exp_month,
					profile.exp_year,
					profile.cvv,
				]
			);
		}

		return NextResponse.json(
			{
				profileGroupId: newGroupId,
				newGroupName: newGroupName,
				message: 'Profile group duplicated successfully',
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('❌ Error duplicating profile group:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
