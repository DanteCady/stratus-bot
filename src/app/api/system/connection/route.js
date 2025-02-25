import { NextResponse } from 'next/server';
import { queryDatabase } from '@/utils/db';

const GO_SERVER_URL = process.env.GO_SERVER_URL || 'http://localhost:8080/health';

/**
 * Checks both the database and the Go server.
 * Returns statuses for each service.
 */
export async function GET() {
	let dbStatus = 'down';
	let goServerStatus = 'down';

	try {
		// Check Database Connection
		await queryDatabase('SELECT 1');
		dbStatus = 'ok';
	} catch (error) {
		console.error('❌ Database connection failed:', error);
	}

	try {
		// Check Go Backend Server Connection
		const response = await fetch(GO_SERVER_URL, { method: 'GET' });

		if (response.ok) {
			goServerStatus = 'ok';
		} else {
			console.error('❌ Go server returned an error:', response.statusText);
		}
	} catch (error) {
		console.error('❌ Go server is unreachable:', error);
	}

	// Determine overall status
	let overallStatus = 'down';
	if (dbStatus === 'ok' && goServerStatus === 'ok') {
		overallStatus = 'ok'; // Both working
	} else if (dbStatus === 'ok' || goServerStatus === 'ok') {
		overallStatus = 'partial'; // One service is down
	}

	// Return response
	return NextResponse.json({
		status: overallStatus,
		dbStatus,
		goServerStatus,
	});
}
