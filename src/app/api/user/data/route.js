import { queryDatabase } from '@/utils/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        console.log(`🔄 Fetching all user data for ${userId}`);

        // **Single query fetching all user data at once**
        const [
            taskGroups,
            profileGroups,
            proxyGroups,
            tasks,
            profiles,
            proxies
        ] = await Promise.all([
            queryDatabase('SELECT * FROM task_groups WHERE user_id = ?', [userId]),
            queryDatabase('SELECT * FROM profile_groups WHERE user_id = ?', [userId]),
            queryDatabase('SELECT * FROM proxy_groups WHERE user_id = ?', [userId]),
            queryDatabase('SELECT * FROM tasks WHERE user_id = ?', [userId]),
            queryDatabase('SELECT * FROM profiles WHERE user_id = ?', [userId]),
            queryDatabase('SELECT * FROM proxies WHERE user_id = ?', [userId]),
        ]);

        const userData = {
            taskGroups,
            profileGroups,
            proxyGroups,
            tasks,
            profiles,
            proxies
        };

        console.log(`✅ User data fetched successfully for ${userId}`);
        return Response.json(userData, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching user data:", error);
        return Response.json({ error: "Failed to fetch user data" }, { status: 500 });
    }
}
