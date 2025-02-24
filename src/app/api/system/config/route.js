import { NextResponse } from 'next/server';
import { queryDatabase } from '@/utils/db';
import { authenticateUser } from '@/utils/auth'; 
export async function GET(req) {
    const { isAuthenticated, user } = await authenticateUser(req);

    if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch system configuration data
        const shops = await queryDatabase('SELECT id, name, is_enabled FROM shops');
        const sites = await queryDatabase('SELECT id, name, shop_id, region_id FROM sites');
        const regions = await queryDatabase('SELECT id, name FROM regions');
        const modes = await queryDatabase('SELECT id, name FROM nike_modes');

        return NextResponse.json({
            shops,
            sites,
            regions,
            modes,
        });
    } catch (error) {
        console.error('❌ Database query failed:', error);
        return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
}
