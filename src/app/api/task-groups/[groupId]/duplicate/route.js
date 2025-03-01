import { queryDatabase } from '@/utils/db';
import { getToken } from 'next-auth/jwt';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req, context) {
	try {
		// Authenticate the user
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Validate parameters
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

		// Fetch existing task group
		const existingGroup = await queryDatabase(
			'SELECT task_group_id, user_id, name, is_default FROM task_groups WHERE task_group_id = ? AND user_id = ? LIMIT 1',
			[groupId, token.sub]
		);

		if (!existingGroup.length) {
			return new Response(JSON.stringify({ error: 'Task group not found or unauthorized' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Prevent duplication of the "Default" group
		if (existingGroup[0].is_default) {
			return new Response(JSON.stringify({ error: 'Default task group cannot be duplicated' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Generate a unique name for the duplicate
		let newGroupName = `${existingGroup[0].name} (Copy)`;

		// Prevent duplicate name conflicts
		const existingCopies = await queryDatabase(
			'SELECT name FROM task_groups WHERE user_id = ? AND name LIKE ?',
			[token.sub, `${existingGroup[0].name} (Copy)%`]
		);
		if (existingCopies.length) {
			newGroupName = `${existingGroup[0].name} (Copy ${existingCopies.length + 1})`;
		}

		// Create the duplicated task group
		const newGroupId = uuidv4();
		await queryDatabase(
			'INSERT INTO task_groups (task_group_id, user_id, name, is_default, created_at) VALUES (?, ?, ?, 0, NOW())',
			[newGroupId, token.sub, newGroupName]
		);

		// Fetch tasks from the original task group
		const existingTasks = await queryDatabase(
			'SELECT * FROM tasks WHERE task_group_id = ?',
			[groupId]
		);

		// Duplicate tasks into the new group
		for (const task of existingTasks) {
			const newTaskId = uuidv4();
			await queryDatabase(
				`INSERT INTO tasks (
                    id, 
                    user_id,
                    task_group_id, 
                    site_id,
                    product,
                    proxy_id,
                    monitor_delay,
                    error_delay,
                    mode_id,
                    status,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
				[
					newTaskId,
					token.sub, // Ensure the task belongs to the same user
					newGroupId,
					task.site_id,
					task.product,
					task.proxy_id,
					task.monitor_delay,
					task.error_delay,
					task.mode_id,
					task.status,
				]
			);
		}

		return new Response(
			JSON.stringify({
				taskGroupId: newGroupId,
				newGroupName: newGroupName,
			}),
			{
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('❌ Error duplicating task group:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
