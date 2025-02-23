import { queryDatabase } from '@/utils/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch all dropdown data in parallel for performance optimization
        const [shops, sites, regions, modes] = await Promise.all([
            queryDatabase('SELECT id, name, is_enabled FROM shops ORDER BY name'),
            queryDatabase('SELECT id, name, shop_id, region_id FROM sites ORDER BY name'),
            queryDatabase('SELECT id, name FROM regions ORDER BY name'),
            queryDatabase('SELECT id, name FROM nike_modes ORDER BY name')
        ]);

        // Construct the response
        const responseData = {
            shops,
            sites,
            regions,
            modes
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('❌ Error fetching dropdowns:', error.message);
        return NextResponse.json(
            { error: 'Failed to load dropdown data', details: error.message },
            { status: 500 }
        );
    }
}
