import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req, context) {
	try {
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

		// Fetch existing group
		const existingGroup = await queryDatabase(
			'SELECT * FROM task_groups WHERE id = ? LIMIT 1',
			[groupId]
		);

		if (!existingGroup.length) {
			return new Response(JSON.stringify({ error: 'Task group not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const newGroupId = uuidv4();
		const newGroupName = `${existingGroup[0].name} (Copy)`;

		// Insert new duplicated group
		await queryDatabase(
			'INSERT INTO task_groups (id, user_id, name, created_at) VALUES (?, ?, ?, NOW())',
			[newGroupId, existingGroup[0].user_id, newGroupName]
		);

		// Copy tasks from the old group to the new one
		const existingTasks = await queryDatabase(
			'SELECT * FROM tasks WHERE task_group_id = ?',
			[groupId]
		);

		// Duplicate each task with new IDs
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
					task.user_id,
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
