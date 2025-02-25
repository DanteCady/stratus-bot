import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
	try {
		// Get user token from the request
		const token = await getToken({ req });
		if (!token) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const {
			task_group_id,
			product,
			monitor_delay,
			error_delay,
			mode_id,
			status,
			site_id,
			proxy_id,
		} = await req.json();

		if (!task_group_id) {
			return new Response(JSON.stringify({ error: 'Missing task_group_id' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Insert new task into the database
		const newTaskId = crypto.randomUUID();
		await queryDatabase(
			`INSERT INTO tasks (
                id, 
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
				newTaskId,
				token.sub,
				task_group_id,
				product,
				parseInt(monitor_delay),
				parseInt(error_delay),
				mode_id,
				status || 'pending',
				site_id || null,
				proxy_id || null,
			]
		);

		return new Response(
			JSON.stringify({
				id: newTaskId,
				user_id: token.sub,
				task_group_id,
				product,
				monitor_delay,
				error_delay,
				mode_id,
				status,
				site_id,
				proxy_id,
			}),
			{
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('❌ Error creating task:', error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

export async function GET(req) {
	try {
		const token = await getToken({ req });
		if (!token) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const { searchParams } = new URL(req.url);
		const groupId = searchParams.get('groupId');

		if (!groupId) {
			return new Response(
				JSON.stringify({ error: 'Missing groupId parameter' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		// Join with sites table to get site information
		const tasks = await queryDatabase(
			`SELECT t.*, s.name as site_name 
             FROM tasks t 
             LEFT JOIN sites s ON t.site_id = s.id 
             WHERE t.task_group_id = ? AND t.user_id = ? 
             ORDER BY t.created_at DESC`,
			[groupId, token.sub]
		);

		return new Response(JSON.stringify({ tasks }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('❌ Error fetching tasks:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
