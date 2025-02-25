import NextAuth from 'next-auth';
import { discordProvider } from '@/app/providers/discordProvider';
import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

const authOptions = {
	providers: [discordProvider],
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		async signIn({ user, account }) {
			try {
				console.log('🔄 Sign-in triggered for', user.email);

				const existingUser = await queryDatabase(
					'SELECT id, provider, is_first_login FROM users WHERE email = ? LIMIT 1',
					[user.email]
				);

				let userId;

				if (existingUser.length) {
					const { id, provider, is_first_login } = existingUser[0];
					userId = id;

					if (provider !== account.provider) {
						await queryDatabase(
							'UPDATE users SET provider = ?, provider_id = ? WHERE id = ?',
							[account.provider, user.id, id]
						);
					}

					if (is_first_login === 1) {
						console.log(
							`🟢 First login detected for ${userId}. Creating default task group.`
						);

						await queryDatabase(
							`INSERT INTO task_groups (id, user_id, name, created_at) VALUES (?, ?, 'Default', NOW())`,
							[uuidv4(), userId]
						);

						await queryDatabase(
							`UPDATE users SET is_first_login = 0 WHERE id = ?`,
							[userId]
						);
					}
				} else {
					userId = uuidv4();
					await queryDatabase(
						`INSERT INTO users (id, email, provider, provider_id, is_first_login, created_at)
                         VALUES (?, ?, ?, ?, 1, NOW())`,
						[userId, user.email, account.provider, user.id]
					);

					await queryDatabase(
						`INSERT INTO task_groups (id, user_id, name, created_at) VALUES (?, ?, 'Default', NOW())`,
						[uuidv4(), userId]
					);

					await queryDatabase(
						`UPDATE users SET is_first_login = 0 WHERE id = ?`,
						[userId]
					);
				}

				console.log('✅ Sign-in successful for', user.email);
				return true;
			} catch (error) {
				console.error('❌ Sign-in error:', error);
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
        
            // Prevent login page from redirecting to itself
            if (url === `${baseUrl}/auth/login`) {
                console.log("🚫 Preventing infinite redirect loop to /auth/login.");
                return `${baseUrl}/dashboard`;
            }
        
            // Ensure proper redirect behavior
            if (url.startsWith(baseUrl)) {
                return url;
            }
        
			return `${baseUrl}/dashboard`; // Default redirect after authentication
		},
	},
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	useSecureCookies: process.env.NODE_ENV === 'production',
	cookies: {
		sessionToken: {
			name:
				process.env.NODE_ENV === 'production'
					? '__Secure-next-auth.session-token'
					: 'next-auth.session-token',
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: process.env.NODE_ENV === 'production',
			},
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { authOptions };
