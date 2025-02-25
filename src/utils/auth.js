import { getToken } from 'next-auth/jwt';

/**
 * Validates if a user is authenticated.
 * @param {Request} req - Incoming API request
 * @returns {Promise<{ isAuthenticated: boolean, user: object | null }>}
 */
export async function authenticateUser(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        console.log('Checking user session:', token); // Debugging log

        if (!token) {
            console.log('No session token found - Unauthorized');
            return { isAuthenticated: false, user: null };
        }

        return { isAuthenticated: true, user: token };
    } catch (error) {
        console.error('Error validating authentication:', error);
        return { isAuthenticated: false, user: null };
    }
}
