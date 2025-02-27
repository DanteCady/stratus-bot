import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';

export async function DELETE(req, context) {
	try {
		const groupId = context.params?.groupId;

		if (!groupId) {
			return new Response(JSON.stringify({ error: 'Invalid request' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Check if the profile group is the Default group
		const group = await queryDatabase(
			'SELECT is_default FROM profile_groups WHERE id = ? LIMIT 1',
			[groupId]
		);

		if (!group.length) {
			return new Response(JSON.stringify({ error: 'Profile group not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (group[0].is_default) {
			return new Response(JSON.stringify({ error: 'Default profile group cannot be deleted' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Delete the profile group and associated profiles
		await queryDatabase('DELETE FROM profile_groups WHERE id = ?', [groupId]);

		return new Response(JSON.stringify({ message: 'Profile group deleted successfully' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('❌ Error deleting profile group:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

export async function PUT(req, context) {
    try {
        const { params } = context;  // Await params properly
        const groupId = params?.groupId; //  safe to access

        const { name } = await req.json();
        if (!groupId || !name) {
            return NextResponse.json({ error: 'Profile group name is required' }, { status: 400 });
        }

        await queryDatabase(
            `UPDATE profile_groups SET name = ? WHERE id = ?`,
            [name, groupId]
        );

        return NextResponse.json({ message: 'Profile group renamed successfully' }, { status: 200 });
    } catch (error) {
        console.error('❌ Error renaming profile group:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
