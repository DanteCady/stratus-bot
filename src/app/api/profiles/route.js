export async function GET(req) {
    try {
        const url = new URL(req.url);
        const groupId = url.searchParams.get("groupId");

        if (!groupId) {
            return new Response(JSON.stringify({ error: "Missing profile_group_id" }), { status: 400 });
        }

        const profiles = await queryDatabase("SELECT * FROM profiles WHERE profile_group_id = ?", [groupId]);

        return new Response(JSON.stringify({ profiles }), { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching profiles:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const {
            userId,
            profileGroupId,
            profileName,
            firstName,
            lastName,
            email,
            phone,
            address
        } = await req.json();

        if (!userId || !profileGroupId || !profileName || !firstName || !lastName || !email) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const newProfileId = crypto.randomUUID();

        await queryDatabase(
            "INSERT INTO profiles (id, user_id, profile_group_id, profile_name, first_name, last_name, email, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [newProfileId, userId, profileGroupId, profileName, firstName, lastName, email, phone, address]
        );

        return new Response(JSON.stringify({ success: true, profileId: newProfileId }), { status: 201 });
    } catch (error) {
        console.error("❌ Error creating profile:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
