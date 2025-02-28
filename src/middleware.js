import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	const { pathname } = req.nextUrl;

	console.log(`🔍 Middleware Executed for: ${pathname}`);
	console.log(`🟢 Token Retrieved:`, token);

	// Allow access to auth-related routes
	if (pathname.startsWith('/auth/login') || pathname.startsWith('/api/auth')) {
		return NextResponse.next();
	}

	// Restrict access to /debug route only for authenticated users
	if (pathname.startsWith('/debug') && !token) {
		console.log('🔴 Unauthorized access to /debug - Redirecting');
		return NextResponse.redirect(new URL('/auth/login', req.url));
	}

	// Protect /debug in production, redirect to /dashboard
	if (pathname.startsWith('/debug') && process.env.NODE_ENV === 'production') {
		console.log('🔒 Restricting /debug in production - Redirecting');
		return NextResponse.redirect(new URL('/dashboard', req.url));
	}

	// Allow access if user is authenticated
	if (token) {
		console.log('✅ User is authenticated - Allowing access');
		return NextResponse.next();
	}

	// Redirect unauthenticated users to login
	console.log('🔴 No Session Found - Redirecting to Login');
	return NextResponse.redirect(new URL('/auth/login', req.url));
}

// ✅ Apply middleware to relevant routes
export const config = {
	matcher: ['/dashboard/:path*', '/admin/:path*', '/debug'], 
};
