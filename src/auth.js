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
        // This receives the data from signIn("credentials", { ... }) in authentication.js
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

          const { rows } = await query("SELECT terminate FROM paysense_users WHERE email = $1", [email]);

          // 1. TERMINATION CHECK FOR GOOGLE USERS
          if (rows.length > 0 && rows[0].terminate) {
            return false; // Blocks the sign in completely
          }

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

    async jwt({ token, user, trigger, session }) {
      // This runs on login and whenever the token is read
      try {
        // Refresh data from DB to ensure session is always up-to-date with termination/verification status
        if (token.email) {
          const { rows } = await query(
            "SELECT id, verified, role, stripe_connect_id, terminate, two_fa_enabled FROM paysense_users WHERE email = $1",
            [token.email]
          );

          if (rows.length > 0) {
            token.id = rows[0].id;
            token.verified = rows[0].verified;
            token.role = rows[0].role;
            token.stripe_connect_id = rows[0].stripe_connect_id;
            token.terminate = rows[0].terminate; // CRITICAL for Proxy
            token.two_fa_enabled = rows[0].two_fa_enabled; // CRITICAL for App Logic
          }
        }
        
        // Handle manual session updates if you use update() from useSession
        if (trigger === "update" && session) {
            return { ...token, ...session.user };
        }

        return token;
      } catch (e) {
        console.error("JWT callback error:", e);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (session.user && token) {
          session.user.id = token.id;
          session.user.verified = token.verified;
          session.user.role = token.role;
          session.user.stripe_connect_id = token.stripe_connect_id;
          session.user.terminate = token.terminate; // Pass to frontend & middleware
          session.user.two_fa_enabled = token.two_fa_enabled; // Pass to frontend & middleware
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
    error: "/login", // Redirect to login on auth errors
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 60, // Optional: Auto logout after 30 mins of inactivity for security
  },
});