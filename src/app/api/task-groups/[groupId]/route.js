import { queryDatabase } from '@/utils/db';


export async function PUT(req, context) {
    try {
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

        // Ensure task group exists before renaming
        const existingGroup = await queryDatabase(
            'SELECT id FROM task_groups WHERE id = ? LIMIT 1',
            [groupId]
        );

        if (!existingGroup.length) {
            return new Response(JSON.stringify({ error: "Task group not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Update the task group name
        await queryDatabase('UPDATE task_groups SET name = ? WHERE id = ?', [name, groupId]);

        return new Response(JSON.stringify({ success: true }), {
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
        const { groupId } = params;

        if (!groupId) {
            return new Response(JSON.stringify({ error: "Invalid request" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // First, delete all tasks associated with this group
        await queryDatabase('DELETE FROM tasks WHERE group_id = ?', [groupId]);

        // Now, delete the task group
        await queryDatabase('DELETE FROM task_groups WHERE id = ?', [groupId]);

        return new Response(JSON.stringify({ success: true }), {
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
