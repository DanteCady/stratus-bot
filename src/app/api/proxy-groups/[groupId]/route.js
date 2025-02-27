import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';

export async function DELETE(req, context) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const groupId = context.params?.groupId;
        if (!groupId) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // Check if the proxy group is the Default group
        const group = await queryDatabase(
            'SELECT is_default FROM proxy_groups WHERE id = ? AND user_id = ? LIMIT 1',
            [groupId, token.sub]
        );

        if (!group.length) {
            return NextResponse.json({ error: 'Proxy group not found' }, { status: 404 });
        }

        if (group[0].is_default) {
            return NextResponse.json({ error: 'Default proxy group cannot be deleted' }, { status: 400 });
        }

        // Delete the proxy group and its proxies
        await queryDatabase('DELETE FROM proxies WHERE proxy_group_id = ?', [groupId]);
        await queryDatabase('DELETE FROM proxy_groups WHERE id = ?', [groupId]);

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

        const groupId = context.params?.groupId;
        const { name } = await req.json();

        if (!groupId || !name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        await queryDatabase(
            `UPDATE proxy_groups SET name = ? WHERE id = ? AND user_id = ?`,
            [name, groupId, token.sub]
        );

        return NextResponse.json({ message: 'Proxy group updated successfully' });
    } catch (error) {
        console.error('❌ Error updating proxy group:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
} 