import { queryDatabase } from '@/utils/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const groupId = params.groupId;
    try {
        const group = await queryDatabase('SELECT * FROM account_groups WHERE id = ? AND provider_id = ?', [groupId, session.user.id]);
        return Response.json(group.length ? group[0] : { error: 'Group not found' }, { status: group.length ? 200 : 404 });
    } catch (error) {
        console.error('❌ Error fetching account group:', error);
        return Response.json({ error: 'Failed to fetch account group' }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const groupId = params.groupId;
    const { name, isDefault } = await req.json();
    if (!name && isDefault === undefined) return Response.json({ error: 'No update data provided' }, { status: 400 });

    try {
        await queryDatabase(
            'UPDATE account_groups SET name = ?, is_default = ? WHERE id = ? AND provider_id = ?',
            [name, isDefault, groupId, session.user.id]
        );
        return Response.json({ message: 'Account group updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('❌ Error updating account group:', error);
        return Response.json({ error: 'Failed to update account group' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const groupId = params.groupId;
    try {
        await queryDatabase('DELETE FROM account_groups WHERE id = ? AND provider_id = ?', [groupId, session.user.id]);
        return Response.json({ message: 'Account group deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('❌ Error deleting account group:', error);
        return Response.json({ error: 'Failed to delete account group' }, { status: 500 });
    }
}
