import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
    try {
        // Authenticate user
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            console.error('❌ [401] Unauthorized request - No valid token found.');
            return NextResponse.json({
                error: 'Unauthorized. Please log in.',
                code: 4011
            }, { status: 401 });
        }

        // Parse request body
        const { siteId, modeId, product, proxyId, monitorDelay, errorDelay, taskAmount } = await req.json();

        // Validate required fields
        if (!siteId || !modeId || !product) {
            console.error('❌ [422] Missing required fields:', { siteId, modeId, product });
            return NextResponse.json({
                error: 'Missing required fields. Ensure site, mode, and product are provided.',
                code: 4221
            }, { status: 422 });
        }

        // Create multiple tasks (based on `taskAmount`)
        const tasks = [];
        for (let i = 0; i < taskAmount; i++) {
            const taskId = uuidv4();
            tasks.push([
                taskId, token.sub, proxyId || null, siteId, product, monitorDelay || 3500,
                errorDelay || 3500, modeId, 'pending', new Date() // ✅ Added `created_at`
            ]);
        }

        // Insert tasks into the database
        const placeholders = tasks.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
        await queryDatabase(
            `INSERT INTO tasks (id, user_id, proxy_id, site_id, product, monitor_delay, error_delay, mode_id, status, created_at)
             VALUES ${placeholders}`,
            tasks.flat()
        );

        console.log(`✅ [201] Successfully created ${taskAmount} task(s) for user ${token.sub}`);
        return NextResponse.json({
            message: `${taskAmount} task(s) successfully created!`,
            code: 2010
        }, { status: 201 });

    } catch (error) {
        console.error('❌ [500] Unexpected server error:', error);
        return NextResponse.json({
            error: 'Unexpected server error. Please try again later.',
            code: 5002
        }, { status: 500 });
    }
}
