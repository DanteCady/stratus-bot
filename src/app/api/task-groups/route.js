import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
    try {
        // Authenticate user
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name } = await req.json();
        if (!name) {
            return NextResponse.json({ error: 'Task group name is required' }, { status: 400 });
        }

        // Check if user already has a "Default" group
        const existingDefaultGroup = await queryDatabase(
            `SELECT task_group_id FROM task_groups WHERE user_id = ? AND is_default = 1`,
            [token.sub]
        );

        if (!existingDefaultGroup.length && name === 'Default') {
            // Create the default group
            const defaultGroupId = uuidv4();
            await queryDatabase(
                `INSERT INTO task_groups (task_group_id, user_id, name, is_default, created_at) VALUES (?, ?, ?, 1, NOW())`,
                [defaultGroupId, token.sub, 'Default']
            );
            return NextResponse.json({ message: 'Default task group created', taskGroupId: defaultGroupId }, { status: 201 });
        }

        // Create a new task group
        const taskGroupId = uuidv4();
        await queryDatabase(
            `INSERT INTO task_groups (task_group_id, user_id, name, is_default, created_at) VALUES (?, ?, ?, 0, NOW())`,
            [taskGroupId, token.sub, name]
        );

        return NextResponse.json({ message: 'Task group created successfully', taskGroupId }, { status: 201 });

    } catch (error) {
        console.error('❌ [500] Task group creation error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        // Authenticate user
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = token.sub;

        // Fetch user's task groups
        const existingGroups = await queryDatabase(
            `SELECT task_group_id, name, is_default FROM task_groups WHERE user_id = ?`,
            [userId]
        );

        // Check if a "Default" group exists
        let defaultGroup = existingGroups.find(group => group.is_default);

        if (!defaultGroup) {
            const defaultGroupId = uuidv4();
            await queryDatabase(
                `INSERT INTO task_groups (task_group_id, user_id, name, is_default, created_at) VALUES (?, ?, 'Default', 1, NOW())`,
                [defaultGroupId, userId]
            );

            // Add the new default group to the list
            defaultGroup = { task_group_id: defaultGroupId, name: 'Default', is_default: 1 };
        }

        return NextResponse.json({ taskGroups: [...existingGroups, defaultGroup] }, { status: 200 });

    } catch (error) {
        console.error('❌ [500] Fetching task groups error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
