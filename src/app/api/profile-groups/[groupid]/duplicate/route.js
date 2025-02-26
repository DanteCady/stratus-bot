export async function POST(req, { params }) {
    try {
        const groupId = params.groupId;

        if (!groupId) {
            return new Response(JSON.stringify({ error: "Invalid request data" }), { status: 400 });
        }

        // Fetch original group
        const originalGroup = await queryDatabase("SELECT * FROM profile_groups WHERE id = ?", [groupId]);

        if (originalGroup.length === 0) {
            return new Response(JSON.stringify({ error: "Profile group not found" }), { status: 404 });
        }

        const newGroupId = crypto.randomUUID();
        const newGroupName = `${originalGroup[0].name} (Copy)`;

        // Insert duplicated profile group
        await queryDatabase(
            "INSERT INTO profile_groups (id, user_id, name, is_default) VALUES (?, ?, ?, FALSE)",
            [newGroupId, originalGroup[0].user_id, newGroupName]
        );

        // Fetch all profiles in the original group
        const profiles = await queryDatabase("SELECT * FROM profiles WHERE profile_group_id = ?", [groupId]);

        // Duplicate all profiles into the new group
        for (const profile of profiles) {
            await queryDatabase(
                "INSERT INTO profiles (id, user_id, profile_group_id, profile_name, first_name, last_name, email, phone, address) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)",
                [profile.user_id, newGroupId, profile.profile_name, profile.first_name, profile.last_name, profile.email, profile.phone, profile.address]
            );
        }

        return new Response(JSON.stringify({ success: true, newGroupId }), { status: 201 });
    } catch (error) {
        console.error("❌ Error duplicating profile group:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
