import { queryDatabase } from '@/utils/db';
import { getToken } from 'next-auth/jwt';

export async function PUT(req, context) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        const { params } = context;
        if (!params) {
            return new Response(JSON.stringify({ error: "Missing parameters" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const groupId = params.groupId;
        const { name } = await req.json();

        if (!groupId || !name) {
            return new Response(JSON.stringify({ error: "Invalid request data" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Ensure task group exists and belongs to the user
        const existingGroup = await queryDatabase(
            'SELECT task_group_id, is_default FROM task_groups WHERE task_group_id = ? AND user_id = ? LIMIT 1',
            [groupId, token.sub]
        );

        if (!existingGroup.length) {
            return new Response(JSON.stringify({ error: "Task group not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        if (existingGroup[0].is_default) {
            return new Response(JSON.stringify({ error: "Default task group cannot be renamed" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Update the task group name
        await queryDatabase('UPDATE task_groups SET name = ? WHERE task_group_id = ?', [name, groupId]);

        return new Response(JSON.stringify({ success: true, message: "Task group renamed successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("❌ Error updating task group:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function DELETE(req, { params }) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        const { groupId } = params;

        if (!groupId) {
            return new Response(JSON.stringify({ error: "Invalid request" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Ensure task group exists and belongs to the user
        const existingGroup = await queryDatabase(
            'SELECT task_group_id, is_default FROM task_groups WHERE task_group_id = ? AND user_id = ? LIMIT 1',
            [groupId, token.sub]
        );

        if (!existingGroup.length) {
            return new Response(JSON.stringify({ error: "Task group not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        if (existingGroup[0].is_default) {
            return new Response(JSON.stringify({ error: "Default task group cannot be deleted" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Delete all tasks associated with this task group
        await queryDatabase('DELETE FROM tasks WHERE task_group_id = ?', [groupId]);

        // Now, delete the task group
        await queryDatabase('DELETE FROM task_groups WHERE task_group_id = ?', [groupId]);

        return new Response(JSON.stringify({ success: true, message: "Task group deleted successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("❌ Error deleting task group:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
