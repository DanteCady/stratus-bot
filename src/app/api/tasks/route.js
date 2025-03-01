import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid'; // Use uuid for task IDs

export async function POST(req) {
	try {
		// Get user token from request
		const token = await getToken({ req });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Parse request body
		const {
			task_group_id,
			product,
			monitor_delay,
			error_delay,
			mode_id,
			status = 'pending',
			site_id = null,
			proxy_id = null,
		} = await req.json();

		// Validate required fields
		if (
			!task_group_id ||
			!product ||
			!monitor_delay ||
			!error_delay ||
			!mode_id
		) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Generate unique ID for new task
		const task_id = uuidv4();

		// Insert new task into the database
		const result = await queryDatabase(
			`INSERT INTO tasks (
                task_id,
                user_id,
                task_group_id, 
                product, 
                monitor_delay, 
                error_delay, 
                mode_id, 
                status, 
                site_id,
                proxy_id,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
			[
				task_id,
				token.sub,
				task_group_id,
				product,
				parseInt(monitor_delay) || 0,
				parseInt(error_delay) || 0,
				mode_id,
				status,
				site_id,
				proxy_id,
			]
		);

		// Return success response
		return NextResponse.json({
			success: true,
			task_id,
			id: result.insertId,
		});
	} catch (error) {
		console.error('❌ Error creating task:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function GET(req) {
	try {
		// Authenticate user
		const token = await getToken({ req });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Extract groupId from query parameters
		const { searchParams } = new URL(req.url);
		const groupId = searchParams.get('groupId');

		if (!groupId) {
			return NextResponse.json(
				{ error: 'Missing groupId parameter' },
				{ status: 400 }
			);
		}

		// Clear, readable query without abbreviations
		const tasks = await queryDatabase(
			`SELECT tasks.*, sites.site_name, nike_modes.mode_name
			 FROM tasks 
			 LEFT JOIN sites ON tasks.site_id = sites.site_id
			 LEFT JOIN nike_modes ON tasks.mode_id = nike_modes.mode_id
			 WHERE tasks.task_group_id = ? AND tasks.user_id = ? 
			 ORDER BY tasks.created_at DESC`,
			[groupId, token.sub]
		);

		return NextResponse.json({ tasks }, { status: 200 });
	} catch (error) {
		console.error('❌ Error fetching tasks:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch tasks' },
			{ status: 500 }
		);
	}
}

export async function PUT(req) {
	try {
		// Authenticate user
		const token = await getToken({ req });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const taskData = await req.json();
		const taskId = taskData.task_id;

		if (!taskId) {
			return NextResponse.json({ error: 'Missing task ID' }, { status: 400 });
		}

		// Update the task in the database
		await queryDatabase(
			`UPDATE tasks 
			 SET product = ?,
				 monitor_delay = ?,
				 error_delay = ?,
				 mode_id = ?,
				 site_id = ?,
				 proxy_id = ?
			 WHERE task_id = ? AND user_id = ?`,
			[
				taskData.product,
				taskData.monitor_delay,
				taskData.error_delay,
				taskData.mode_id,
				taskData.site_id,
				taskData.proxy_id,
				taskId,
				token.sub,
			]
		);

		return NextResponse.json(
			{ message: 'Task updated successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('❌ Error updating task:', error);
		return NextResponse.json(
			{ error: 'Failed to update task' },
			{ status: 500 }
		);
	}
}
