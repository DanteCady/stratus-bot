import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
	const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	console.log('🔍 Middleware Executed for:', req.nextUrl.pathname);
	console.log('🟢 Session Found:', session ? 'Yes' : 'No');

	// Allow access to root ("/") and authentication pages
	if (req.nextUrl.pathname === '/') {
		console.log('✅ Allowing Access to Root');
		return NextResponse.next();
	}

	// Redirect unauthenticated users to login
	if (!session) {
		console.log('🔴 No Session Found - Redirecting to Login');
		return NextResponse.redirect(new URL('/', req.url));
	}

	console.log('✅ User Authenticated - Allowing Access');
	return NextResponse.next();
}

// Apply middleware to **all** routes except the root "/" and static files
export const config = {
	matcher:
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:mp4|webm|ogg)).*)',
};
