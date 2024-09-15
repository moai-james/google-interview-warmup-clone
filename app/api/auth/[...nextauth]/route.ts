import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add your own logic here to validate credentials
        // This is where you would typically check against your database
        // Return null if credentials are invalid
        // Return a user object if credentials are valid
        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          return { id: "1", name: "J Smith", email: "jsmith@example.com" }
        }
        return null
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Log the sign-in attempt
      console.log("Sign-in attempt:", { user, account, profile });
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Log the redirect attempt
      console.log("Redirect attempt:", { url, baseUrl });
      return baseUrl;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // Log the JWT creation
      console.log("JWT creation:", { token, user, account, profile, isNewUser });
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
})

export { handler as GET, handler as POST }

export const authOptions = {
  // Your auth options configuration
};
