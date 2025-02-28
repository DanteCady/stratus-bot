import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
	try {
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

		// Ensure user is authenticated
		if (!token || !token.sub) {
			console.error('❌ GET Profiles: User is not authenticated.');
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const profile_group_id = searchParams.get('groupId'); 

		if (!profile_group_id) {
			return NextResponse.json(
				{ error: 'Profile Group ID is required' },
				{ status: 400 }
			);
		}

		// Fetch profiles belonging to the user & profile group
		const profiles = await queryDatabase(
			`SELECT profile_id, profile_name, first_name, last_name, email, phone, address, city, state, country, zipcode, cardholder, card_number, exp_month, exp_year, cvv
             FROM profiles 
             WHERE profile_group_id = ? AND user_id = ?`,
			[profile_group_id, token.sub]
		);

		return NextResponse.json({ profiles });
	} catch (error) {
		console.error('❌ Error fetching profiles:', error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const userId = session.user.id;
		const profile = await req.json();

		// Validate required fields
		const requiredFields = [
			'profileName',
			'firstName',
			'lastName',
			'email',
			'phone',
			'address',
			'city',
			'state',
			'zipcode',
			'country',
			'cardNumber',
			'cardholder',
			'expMonth',
			'expYear',
			'cvv',
		];

		const missingFields = requiredFields.filter((field) => !profile[field]);
		if (missingFields.length > 0) {
			return NextResponse.json(
				{
					error: `Missing required fields: ${missingFields.join(', ')}`,
				},
				{ status: 400 }
			);
		}

		// Generate UUID for profile_id
		const profileId = uuidv4();

		// Create new profile
		await queryDatabase(
			`
			INSERT INTO profiles (
				profile_id,
				user_id,
				profile_group_id,
				profile_name,
				first_name,
				last_name,
				email,
				phone,
				address,
				address2,
				city,
				state,
				zipcode,
				country,
				card_number,
				cardholder,
				exp_month,
				exp_year,
				cvv
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`,
			[
				profileId, // Unique identifier
				userId,
				profile.profileGroupId || uuidv4(), // If not provided, generate new group
				profile.profileName,
				profile.firstName,
				profile.lastName,
				profile.email,
				profile.phone,
				profile.address,
				profile.address2 || null,
				profile.city,
				profile.state,
				profile.zipcode,
				profile.country,
				profile.cardNumber,
				profile.cardholder,
				profile.expMonth,
				profile.expYear,
				profile.cvv,
			]
		);

		return NextResponse.json({
			success: true,
			profileId,
		});
	} catch (error) {
		console.error('Error creating profile:', error);
		return NextResponse.json(
			{
				error: 'Failed to create profile',
			},
			{ status: 500 }
		);
	}
}
