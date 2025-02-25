import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    console.log(`🔍 Middleware Executed for: ${pathname}`);
    console.log(`🟢 Session Found:`, token ? "Yes" : "No");

    // Allow access to login page without redirecting
    if (pathname.startsWith('/auth/login') || pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    // Allow access to public pages (if needed)
    if (pathname.startsWith('/public')) {
        return NextResponse.next();
    }

    // If user is logged in, allow access
    if (token) {
        console.log("✅ User is authenticated - Allowing access");
        return NextResponse.next();
    }

    // ❌ If user is NOT logged in, redirect to login
    console.log("🔴 No Session Found - Redirecting to Login");
    return NextResponse.redirect(new URL('/auth/login', req.url));
}

// Apply middleware only to protected routes
export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'], // Define which routes require authentication
};