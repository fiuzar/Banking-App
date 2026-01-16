import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Google,
    Credentials({
      credentials: {
        id: { label: "Id", type: "number" },
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.id || !credentials?.email || !credentials?.name) {
          throw new Error("Missing credentials");
        }

        const user = {
          id: parseInt(credentials.id),
          name: credentials.name,
          email: credentials.email,
          role: "USER",
        };

        return user
      },
    }),
  ],

  pages: {
    signIn: "/login",
    signOut: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      // 🧩 You must RETURN the token here
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = "USER";
      }
      return token;
    },

    async session({ session, token }) {
      // 🧩 Safely attach values
      if (session?.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
