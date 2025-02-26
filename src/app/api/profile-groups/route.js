import { queryDatabase } from '@/utils/db';

export async function GET(req) {
    try {
        const userId = req.headers.get("user_id"); // Get user_id from headers or auth session

        const profileGroups = await queryDatabase(
            "SELECT * FROM profile_groups WHERE user_id = ? ORDER BY is_default DESC, created_at ASC",
            [userId]
        );

        return new Response(JSON.stringify({ profileGroups }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("❌ Error fetching profile groups:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { name, isDefault = false, userId } = await req.json();

        if (!name || !userId) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // Ensure only ONE default profile group exists per user
        if (isDefault) {
            await queryDatabase(
                "UPDATE profile_groups SET is_default = FALSE WHERE user_id = ?",
                [userId]
            );
        }

        const result = await queryDatabase(
            "INSERT INTO profile_groups (id, user_id, name, is_default) VALUES (UUID(), ?, ?, ?)",
            [userId, name, isDefault]
        );

        return new Response(JSON.stringify({ profileGroupId: result.insertId }), { status: 201 });
    } catch (error) {
        console.error("❌ Error creating profile group:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
