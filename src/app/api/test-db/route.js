import { queryDatabase } from '@/utils/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Run a simple query to check database connection
        await queryDatabase('SELECT 1');

        // If successful, return success response
        return NextResponse.json({ message: '✅ Database connection successful!' });
    } catch (error) {
        console.error('❌ Database Connection Error:', error.message);
        return NextResponse.json(
            { error: '❌ Database connection failed', details: error.message },
            { status: 500 }
        );
    }
}
