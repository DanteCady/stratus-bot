import GitHubProvider from 'next-auth/providers/github';

export const githubProvider = GitHubProvider({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
});
