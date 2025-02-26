export async function DELETE(req, { params }) {
    try {
        const groupId = params.groupId;

        if (!groupId) {
            return new Response(JSON.stringify({ error: "Invalid request data" }), { status: 400 });
        }

        await queryDatabase("DELETE FROM profile_groups WHERE id = ?", [groupId]);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("❌ Error deleting profile group:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
