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
            `SELECT id FROM task_groups WHERE user_id = ? AND name = 'Default'`,
            [token.sub]
        );

        if (!existingDefaultGroup.length && name === 'Default') {
            // Create default group if missing
            const defaultGroupId = uuidv4();
            await queryDatabase(
                `INSERT INTO task_groups (id, user_id, name, created_at) VALUES (?, ?, ?, NOW())`,
                [defaultGroupId, token.sub, 'Default']
            );
            return NextResponse.json({ message: 'Default task group created', taskGroupId: defaultGroupId }, { status: 201 });
        }

        // Create new task group
        const taskGroupId = uuidv4();
        await queryDatabase(
            `INSERT INTO task_groups (id, user_id, name, created_at) VALUES (?, ?, ?, NOW())`,
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
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = token.sub;

        // Check if user already has task groups
        const existingGroups = await queryDatabase(
            `SELECT id, name FROM task_groups WHERE user_id = ?`,
            [userId]
        );

        let defaultGroup = existingGroups.find(group => group.name === 'Default');

        // If no Default group exists, create it automatically
        if (!defaultGroup) {
            const defaultGroupId = uuidv4();
            await queryDatabase(
                `INSERT INTO task_groups (id, user_id, name, created_at) VALUES (?, ?, 'Default', NOW())`,
                [defaultGroupId, userId]
            );

            defaultGroup = { id: defaultGroupId, name: 'Default' };
        }

        return NextResponse.json({ taskGroups: [...existingGroups, defaultGroup] }, { status: 200 });

    } catch (error) {
        console.error('❌ [500] Fetching task groups error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

