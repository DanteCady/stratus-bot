import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * @desc Create a new profile group or ensure the Default group exists
 * @route POST /api/profile-groups
 */
export async function POST(req) {
    try {
        // Authenticate user
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name } = await req.json();
        if (!name) {
            return NextResponse.json({ error: 'Profile group name is required' }, { status: 400 });
        }

        // Check if user already has a "Default" group
        const existingDefaultGroup = await queryDatabase(
            `SELECT id FROM profile_groups WHERE user_id = ? AND name = 'Default'`,
            [token.sub]
        );

        if (!existingDefaultGroup.length && name === 'Default') {
            // Create default group if missing
            const defaultGroupId = uuidv4();
            await queryDatabase(
                `INSERT INTO profile_groups (id, user_id, name, is_default, created_at) VALUES (?, ?, ?, 1, NOW())`,
                [defaultGroupId, token.sub, 'Default']
            );
            return NextResponse.json({ message: 'Default profile group created', profileGroupId: defaultGroupId }, { status: 201 });
        }

        // Create new profile group
        const profileGroupId = uuidv4();
        await queryDatabase(
            `INSERT INTO profile_groups (id, user_id, name, is_default, created_at) VALUES (?, ?, ?, 0, NOW())`,
            [profileGroupId, token.sub, name]
        );

        return NextResponse.json({ message: 'Profile group created successfully', profileGroupId }, { status: 201 });

    } catch (error) {
        console.error('❌ [500] Profile group creation error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

/**
 * @desc Fetch all profile groups for the user, ensuring Default group exists
 * @route GET /api/profile-groups
 */
export async function GET(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = token.sub;

        // Check if user already has profile groups
        const existingGroups = await queryDatabase(
            `SELECT id, name FROM profile_groups WHERE user_id = ?`,
            [userId]
        );

        let defaultGroup = existingGroups.find(group => group.name === 'Default');

        // If no Default group exists, create it automatically
        if (!defaultGroup) {
            const defaultGroupId = uuidv4();
            await queryDatabase(
                `INSERT INTO profile_groups (id, user_id, name, is_default, created_at) VALUES (?, ?, 'Default', 1, NOW())`,
                [defaultGroupId, userId]
            );

            defaultGroup = { id: defaultGroupId, name: 'Default' };
        }

        return NextResponse.json({ profileGroups: [...existingGroups, defaultGroup] }, { status: 200 });

    } catch (error) {
        console.error('❌ [500] Fetching profile groups error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
