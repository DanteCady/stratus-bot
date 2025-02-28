import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';

export async function DELETE(req, context) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const proxy_group_id = context.params?.groupId;
        if (!proxy_group_id) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // Check if the proxy group exists and belongs to the user
        const group = await queryDatabase(
            'SELECT is_default FROM proxy_groups WHERE proxy_group_id = ? AND user_id = ? LIMIT 1',
            [proxy_group_id, token.sub]
        );

        if (!group.length) {
            return NextResponse.json({ error: 'Proxy group not found' }, { status: 404 });
        }

        if (group[0].is_default) {
            return NextResponse.json({ error: 'Default proxy group cannot be deleted' }, { status: 400 });
        }

        // Delete all proxies linked to the proxy group
        await queryDatabase('DELETE FROM proxies WHERE proxy_group_id = ?', [proxy_group_id]);
        
        // Delete the proxy group
        await queryDatabase('DELETE FROM proxy_groups WHERE proxy_group_id = ?', [proxy_group_id]);

        return NextResponse.json({ message: 'Proxy group deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting proxy group:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req, context) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const proxy_group_id = context.params?.groupId;
        const { name } = await req.json();

        if (!proxy_group_id || !name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Update the proxy group name (ensuring it belongs to the user)
        const updated = await queryDatabase(
            `UPDATE proxy_groups SET name = ? WHERE proxy_group_id = ? AND user_id = ?`,
            [name, proxy_group_id, token.sub]
        );

        if (updated.affectedRows === 0) {
            return NextResponse.json({ error: 'Proxy group not found or update failed' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Proxy group updated successfully' });
    } catch (error) {
        console.error('❌ Error updating proxy group:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
