import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    console.log(`🔍 Middleware Executed for: ${pathname}`);
    console.log(`🟢 Token Retrieved:`, token);

    if (pathname.startsWith('/auth/login') || pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    if (token) {
        console.log("✅ User is authenticated - Allowing access");
        return NextResponse.next();
    }

    console.log("🔴 No Session Found - Redirecting to Login");
    return NextResponse.redirect(new URL('/auth/login', req.url));
}

// Apply middleware only to protected routes
export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'], // Define which routes require authentication
};