import { getToken } from 'next-auth/jwt';
import { queryDatabase } from '@/utils/db';

/**
 * Middleware-like function to verify authentication in API routes.
 * Supports optional admin access.
 *
 * @param {Request} req - Incoming API request
 * @returns {Promise<{ isAuthenticated: boolean, user: object }>}
 */
export async function authenticateUser(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return { isAuthenticated: false, user: null };
    }

    try {
        const user = await queryDatabase('SELECT * FROM users WHERE id = ?', [token.sub]);

        if (!user.length) {
            return { isAuthenticated: false, user: null };
        }

        return { isAuthenticated: true, user: user[0] };
    } catch (error) {
        console.error('Auth validation failed:', error);
        return { isAuthenticated: false, user: null };
    }
}
