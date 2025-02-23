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
                const existingUser = await queryDatabase(
                    'SELECT id, provider FROM users WHERE email = ? LIMIT 1',
                    [user.email]
                );

                if (existingUser.length) {
                    const { id, provider } = existingUser[0];

                    if (provider !== account.provider) {
                        await queryDatabase(
                            'UPDATE users SET provider = ?, provider_id = ? WHERE id = ?',
                            [account.provider, user.id, id]
                        );
                    }
                } else {
                    const newUserId = uuidv4();
                    await queryDatabase(
                        `INSERT INTO users (id, email, provider, provider_id, created_at)
                         VALUES (?, ?, ?, ?, NOW())`,
                        [newUserId, user.email, account.provider, user.id]
                    );
                }

                console.log('✅ User successfully signed in:', user.email);
                return true;
            } catch (error) {
                console.error('❌ Error during sign-in:', error);
                return `/auth/error?message=${encodeURIComponent(error.message)}`;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.sub ?? null;
            return session;
        },
        async redirect({ url, baseUrl }) {
          console.log("🔄 Redirect callback fired:", { url, baseUrl });
      
          if (url.startsWith('/')) return `${baseUrl}${url}`;
          return `${baseUrl}/dashboard`; 
      }      
    },
    pages: {
        signIn: '/',
        error: '/auth/error',
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
