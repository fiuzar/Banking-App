import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { query } from "@/dbh";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.id) return null;
        return {
          id: credentials.id,
          name: credentials.name,
          email: credentials.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          const email = profile?.email?.toLowerCase();
          const firstName = profile?.given_name || "User";
          const lastName = profile?.family_name || "";
          const image = profile?.picture;

          const { rows } = await query("SELECT * FROM paysense_users WHERE email = $1", [email]);

          if (rows.length === 0) {
            // New user via Google
            await query(
              "INSERT INTO paysense_users (first_name, last_name, email, password, verified, image, role) VALUES ($1, $2, $3, $4, $5, $6, $7)",
              [firstName, lastName, email, "social", true, image, 'user']
            );
          }
          return true;
        } catch (error) {
          console.error("Google Sync Error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      // This runs on login and whenever the token is read
      try {
        if (user || !token.role) { 
          // Re-fetch user data to ensure role and stripe_id are always present
          const { rows } = await query(
            "SELECT id, verified, role, stripe_connect_id FROM paysense_users WHERE email = $1",
            [token.email]
          );

          if (rows.length > 0) {
            token.id = rows[0].id;
            token.verified = rows[0].verified;
            token.role = rows[0].role; // Needed for Admin
            token.stripe_connect_id = rows[0].stripe_connect_id; // Needed for Finance
          }
        }
        return token;
      } catch (e) {
        console.error("JWT callback error:", e);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.id;
          session.user.verified = token.verified;
          session.user.role = token.role; // Now accessible in frontend as session.data.user.role
          session.user.stripe_connect_id = token.stripe_connect_id;
        }
        return session;
      } catch (e) {
        console.error("Session callback error:", e);
        return session;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});