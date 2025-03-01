import NextAuth from 'next-auth';
import { discordProvider } from '@/app/providers/discordProvider';
import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

/** Function to check if column exists in a table */
async function columnExists(table, column) {
	try {
		const result = await queryDatabase(
			`SELECT COUNT(*) AS count FROM information_schema.columns WHERE table_name = ? AND column_name = ?`,
			[table, column]
		);
		return result[0].count > 0;
	} catch (error) {
		console.error(`❌ Error checking column ${column} in ${table}:`, error);
		return false;
	}
}

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

				// Check if user exists in the database
				const existingUser = await queryDatabase(
					'SELECT provider_id, is_first_login FROM users WHERE email = ? LIMIT 1',
					[user.email]
				);

				let userId;

				if (existingUser.length) {
					const { provider_id, is_first_login } = existingUser[0];
					userId = provider_id;

					// **First-time login setup**
					if (is_first_login === 1) {
						console.log(
							`🟢 First login detected for ${userId}. Creating default groups.`
						);

						// Create missing default groups
						const defaultGroups = [
							{
								table: 'task_groups',
								column: 'task_group_id',
								name: 'Default',
							},
							{
								table: 'profile_groups',
								column: 'profile_group_id',
								name: 'Default',
							},
							{
								table: 'proxy_groups',
								column: 'proxy_group_id',
								name: 'Default',
							},
							{
								table: 'account_groups',
								column: 'account_group_id',
								name: 'Default',
							},
						];

						for (const group of defaultGroups) {
							const existingGroup = await queryDatabase(
								`SELECT ${group.column} FROM ${group.table} WHERE user_id = ? LIMIT 1`,
								[userId]
							);

							if (!existingGroup.length) {
								await queryDatabase(
									`INSERT INTO ${group.table} (${group.column}, user_id, name, is_default, created_at) VALUES (?, ?, ?, 1, NOW())`,
									[uuidv4(), userId, group.name]
								);
							}
						}

						// Mark first login as completed
						await queryDatabase(
							`UPDATE users SET is_first_login = 0 WHERE provider_id = ?`,
							[userId]
						);
					}
				} else {
					// **New user registration**
					userId = user.id; // The `provider_id` from Discord login

					await queryDatabase(
						`INSERT INTO users (user_id, email, provider, provider_id, is_first_login, created_at)
						 VALUES (?, ?, ?, ?, 1, NOW())`,
						[uuidv4(), user.email, account.provider, userId]
					);

					// Create default groups for new user
					const defaultGroups = [
						{ table: 'task_groups', column: 'task_group_id', name: 'Default' },
						{
							table: 'profile_groups',
							column: 'profile_group_id',
							name: 'Default',
						},
						{
							table: 'proxy_groups',
							column: 'proxy_group_id',
							name: 'Default',
						},
						{
							table: 'account_groups',
							column: 'account_group_id',
							name: 'Default',
						},
					];

					for (const group of defaultGroups) {
						await queryDatabase(
							`INSERT INTO ${group.table} (${group.column}, user_id, name, is_default, created_at) VALUES (?, ?, ?, 1, NOW())`,
							[uuidv4(), userId, group.name]
						);
					}

					// Mark first login as completed
					await queryDatabase(
						`UPDATE users SET is_first_login = 0 WHERE provider_id = ?`,
						[userId]
					);
				}

				// Fetch system and user-specific data
				const [
					shops,
					sites,
					regions,
					modes,
					taskGroups,
					profileGroups,
					proxyGroups,
					accountGroups,
					tasks,
					profiles,
					proxies,
				] = await Promise.all([
					queryDatabase('SELECT id, name, is_enabled FROM shops'),
					queryDatabase('SELECT id, name, shop_id, region_id FROM sites'),
					queryDatabase('SELECT id, name FROM regions'),
					queryDatabase('SELECT id, name FROM nike_modes'),
					queryDatabase('SELECT * FROM task_groups WHERE user_id = ?', [
						userId,
					]),
					queryDatabase('SELECT * FROM profile_groups WHERE user_id = ?', [
						userId,
					]),
					queryDatabase('SELECT * FROM proxy_groups WHERE user_id = ?', [
						userId,
					]),
					queryDatabase('SELECT * FROM account_groups WHERE user_id = ?', [
						userId,
					]),
					queryDatabase('SELECT * FROM tasks WHERE user_id = ?', [userId]),
					queryDatabase('SELECT * FROM profiles WHERE user_id = ?', [userId]),
					queryDatabase('SELECT * FROM proxies WHERE user_id = ?', [userId]),
				]);

				console.log('✅ Sign-in successful for', user.email);
				return {
					...user,
					initialData: {
						system: { shops, sites, regions, modes },
						user: {
							taskGroups,
							profileGroups,
							proxyGroups,
							accountGroups,
							tasks,
							profiles,
							proxies,
						},
					},
				};
			} catch (error) {
				console.error('❌ Sign-in error:', error);
				return `/auth/error?message=${encodeURIComponent(error.message)}`;
			}
		},
		/** JWT callback ensures the correct user ID is attached */
		async jwt({ token, user }) {
			if (user) {
				token.sub = user.id;
				token.provider_id = user.provider_id;
			}
			return token;
		},

		/** Attach user ID to session */
		async session({ session, token }) {
			session.user.id = token.sub ?? null;
			return session;
		},

		/** Handles redirects properly */
		async redirect({ url, baseUrl }) {
			console.log('🔄 Redirect callback fired:', { url, baseUrl });

			// Prevent login page redirect loop
			if (url === `${baseUrl}/auth/login`) {
				console.log('🚫 Preventing infinite redirect loop to /auth/login.');
				return `${baseUrl}/dashboard`;
			}

			// Ensure valid redirect behavior
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
