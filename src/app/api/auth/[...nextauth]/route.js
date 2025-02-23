import NextAuth from 'next-auth';
import { discordProvider } from '@/providers/discordProvider';

export const authOptions = {
  providers: [discordProvider], // Keep GitHub but focus on Discord for now
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub; // Store user ID in session
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
