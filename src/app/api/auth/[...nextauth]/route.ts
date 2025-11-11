import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { JWT } from "next-auth/jwt";
import { Account, Session, User } from "next-auth";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: 'https://accounts.spotify.com/authorize?scope=user-top-read',
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }): Promise<JWT> {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }: { session: Session; token: JWT; user: User }): Promise<Session> {
      session.accessToken = token.accessToken as string;
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }