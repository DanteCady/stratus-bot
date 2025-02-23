import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      return true; // Allow sign-in
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub; // Assign user ID from provider
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Secure the auth process
  pages: {
    signIn: "/", // Redirect to custom login page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
