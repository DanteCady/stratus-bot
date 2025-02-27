import { queryDatabase } from '@/utils/db';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const groupId = searchParams.get('groupId');

		if (!groupId) {
			return NextResponse.json(
				{ error: 'Group ID is required' },
				{ status: 400 }
			);
		}

		const profiles = await queryDatabase(
			'SELECT * FROM profiles WHERE profile_group_id = ?',
			[groupId]
		);

		return NextResponse.json({ profiles });
	} catch (error) {
		console.error('❌ Error fetching profiles:', error);
		return NextResponse.json(
			{ error: 'Database query failed' },
			{ status: 500 }
		);
	}
}

export async function POST(req) {
	try {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const profileData = await req.json();
		const {
			profileGroupId,
			profileName,
			firstName,
			lastName,
			email,
			phone,
			address,
			address2,
			country,
			state,
			city,
			zipcode,
			cardholder,
			cardNumber,
			expMonth,
			expYear,
			cvv,
		} = profileData;

		if (!profileGroupId || !profileName || !firstName || !lastName || !email) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const newProfileId = uuidv4();

		await queryDatabase(
			`INSERT INTO profiles (
				id, 
				user_id,
				profile_group_id,
				profile_name,
				first_name,
				last_name,
				email,
				phone,
				address,
				address2,
				country,
				state,
				city,
				zipcode,
				cardholder,
				card_number,
				exp_month,
				exp_year,
				cvv,
				created_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
			[
				newProfileId,
				token.sub,
				profileGroupId,
				profileName,
				firstName,
				lastName,
				email,
				phone || null,
				address || null,
				address2 || null,
				country || null,
				state || null,
				city || null,
				zipcode || null,
				cardholder || null,
				cardNumber || null,
				expMonth || null,
				expYear || null,
				cvv || null,
			]
		);

		return NextResponse.json(
			{
				success: true,
				profileId: newProfileId,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('❌ Error creating profile:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
