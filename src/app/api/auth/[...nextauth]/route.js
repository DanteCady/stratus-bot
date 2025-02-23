import NextAuth from 'next-auth';
import { discordProvider } from '../../../providers/discordProvider';

export const authOptions = {
  providers: [discordProvider], // Keep GitHub but focus on Discord for now
  session: {
    strategy: 'jwt', // Uses JWT for session management
    maxAge: 30 * 24 * 60 * 60, // 30 days before requiring login again
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub; // Store user ID in session
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the provided URL if valid, otherwise send to /dashboard
      return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/', // Ensure it redirects to the login page when signing out
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
