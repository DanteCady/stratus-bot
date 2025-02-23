import NextAuth from 'next-auth';
import { discordProvider } from '../../../providers/discordProvider';
import { queryDatabase } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export const authOptions = {
  providers: [discordProvider], // Keeping only Discord for now
  session: {
    strategy: 'jwt', // Uses JWT for session management
    maxAge: 30 * 24 * 60 * 60, // 30 days before requiring login again
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        const userId = uuidv4(); // Generate a UUID for new users

        // Check if the user already exists
        const existingUser = await queryDatabase(
          'SELECT id FROM users WHERE provider_id = ? LIMIT 1',
          [user.id]
        );

        if (!existingUser.length) {
          // Insert the new user if they don't exist
          await queryDatabase(
            `INSERT INTO users (id, email, provider, provider_id, created_at)
             VALUES (?, ?, ?, ?, NOW())`,
            [userId, user.email, account.provider, user.id]
          );
        }

        return true; // Allow sign-in
      } catch (error) {
        console.error('❌ Error saving user:', error);
        return false; // Deny login if there's an issue
      }
    },
    async session({ session, token }) {
      session.user.id = token.sub; // Store user ID in session
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect user after login to the dashboard
      return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/', // Redirect to the login page when signing out
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
