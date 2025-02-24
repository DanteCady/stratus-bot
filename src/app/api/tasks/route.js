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

        const { site_id, mode_id, account_id, proxy_id, product, monitor_delay, error_delay } = await req.json();

        // Validate required fields
        if (!site_id || !mode_id || !account_id || !product) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate unique task ID
        const taskId = uuidv4();

        // Insert task into database
        await queryDatabase(
            `INSERT INTO tasks (id, user_id, account_id, proxy_id, site_id, product, mode_id, monitor_delay, error_delay, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
            [taskId, token.sub, account_id, proxy_id || null, site_id, product, mode_id, monitor_delay || 3500, error_delay || 3500]
        );

        return NextResponse.json({ message: 'Task created successfully', taskId }, { status: 201 });

    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
