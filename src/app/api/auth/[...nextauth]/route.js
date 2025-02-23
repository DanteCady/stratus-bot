import NextAuth from 'next-auth';
import { discordProvider } from '../../../providers/discordProvider';
import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export const authOptions = {
    providers: [discordProvider], 
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async signIn({ user, account }) {
            try {
                const userId = uuidv4();

                const existingUser = await queryDatabase(
                    'SELECT id FROM users WHERE provider_id = ? LIMIT 1',
                    [user.id]
                );

                if (!existingUser.length) {
                    await queryDatabase(
                        `INSERT INTO users (id, email, provider, provider_id, created_at)
                         VALUES (?, ?, ?, ?, NOW())`,
                        [userId, user.email, account.provider, user.id]
                    );
                }

                console.log('✅ User successfully signed in:', user.email);
                return true;
            } catch (error) {
                console.error('❌ Error during sign-in:', error);
                return `/auth/error?message=${encodeURIComponent(error.message)}`; // Redirect to error page
            }
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
        },
    },
    pages: {
        signIn: '/',
        error: '/auth/error', // Custom error page
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
