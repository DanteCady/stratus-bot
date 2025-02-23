import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

/**
 * Middleware-like function to verify authentication in API routes.
 * Supports optional admin access.
 *
 * @param {Request} req - Incoming API request
 * @param {boolean} requireAdmin - Whether only admins should access the route
 * @returns {Promise<{ user: object } | { error: string, status: number }>}
 */
export async function authenticateRequest(req, requireAdmin = false) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return { error: 'Unauthorized', status: 401 };
    }

    try {
        // Example: Fetch user from database (modify as needed)
        const user = await queryDatabase('SELECT * FROM users WHERE id = ?', [token.sub]);

        if (!user.length) {
            return { error: 'User not found', status: 403 };
        }

        const loggedInUser = user[0];

        // If admin access is required but the user is not an admin, deny access
        if (requireAdmin && loggedInUser.role !== 'admin') {
            return { error: 'Forbidden: Admins only', status: 403 };
        }

        return { user: loggedInUser };
    } catch (error) {
        console.error('Auth validation failed:', error);
        return { error: 'Server error', status: 500 };
    }
}
