import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

export async function POST(req, context) {
	try {
		const { params } = context;
		if (!params) {
			return new Response(JSON.stringify({ error: 'Missing parameters' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		const groupId = params.groupId;

		if (!groupId) {
			return new Response(JSON.stringify({ error: 'Invalid request' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Fetch the existing profile group
		const existingGroup = await queryDatabase(
			'SELECT * FROM profile_groups WHERE id = ? LIMIT 1',
			[groupId]
		);

		if (!existingGroup.length) {
			return new Response(
				JSON.stringify({ error: 'Profile group not found' }),
				{
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		const { user_id, name, is_default } = existingGroup[0];

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
			'INSERT INTO profile_groups (id, user_id, name, is_default, created_at) VALUES (?, ?, ?, ?, NOW())',
			[newGroupId, user_id, newGroupName, 0]
		);

		// Duplicate profiles under this group
		const profiles = await queryDatabase(
			'SELECT * FROM profiles WHERE profile_group_id = ?',
			[groupId]
		);

		for (const profile of profiles) {
			await queryDatabase(
				`INSERT INTO profiles (id, user_id, profile_group_id, profile_name, first_name, last_name, email, phone, address, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
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
				]
			);
		}

		return new Response(
			JSON.stringify({
				profileGroupId: newGroupId,
				newGroupName: newGroupName,
			}),
			{
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('❌ Error duplicating profile group:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
