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
                    'SELECT id, provider, is_first_login FROM users WHERE email = ? LIMIT 1',
                    [user.email]
                );

                let userId;

                if (existingUser.length) {
                    const { id, provider, is_first_login } = existingUser[0];
                    userId = id;

                    // Update provider if needed
                    if (provider !== account.provider) {
                        await queryDatabase(
                            'UPDATE users SET provider = ?, provider_id = ? WHERE id = ?',
                            [account.provider, user.id, id]
                        );
                    }

                    // ✅ Check if it's the user's first login
                    if (is_first_login === 1) {
                        console.log(`🟢 User ${userId} logging in for the first time. Creating default task group...`);

                        // Create the default task group
                        await queryDatabase(
                            `INSERT INTO task_groups (id, user_id, name, created_at) VALUES (?, ?, 'Default', NOW())`,
                            [uuidv4(), userId]
                        );

                        // Update `is_first_login` to 0
                        await queryDatabase(`UPDATE users SET is_first_login = 0 WHERE id = ?`, [userId]);

                        console.log(`✅ User ${userId} is_first_login set to 0.`);
                    }

                } else {
                    // **New User Registration**
                    userId = uuidv4();
                    await queryDatabase(
                        `INSERT INTO users (id, email, provider, provider_id, is_first_login, created_at)
                         VALUES (?, ?, ?, ?, 1, NOW())`,
                        [userId, user.email, account.provider, user.id]
                    );

                    console.log(`🆕 New user ${user.email} registered with ID: ${userId}`);

                    // ✅ First login: Create default task group
                    await queryDatabase(
                        `INSERT INTO task_groups (id, user_id, name, created_at) VALUES (?, ?, 'Default', NOW())`,
                        [uuidv4(), userId]
                    );

                    // Update `is_first_login` to 0
                    await queryDatabase(`UPDATE users SET is_first_login = 0 WHERE id = ?`, [userId]);

                    console.log(`✅ Default task group created and is_first_login set to 0 for new user ${user.email}`);
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
