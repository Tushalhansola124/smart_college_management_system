import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { API_ENDPOINTS } from "@/app/core/constants/api_endpoint";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== AUTHORIZE CALLED ===");
        console.log("Credentials received:", {
          email: credentials?.email,
          hasPassword: !!credentials?.password,
        });

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing email or password");
          return null;
        }

        const loginUrl = `${process.env.SERVER_URL}${API_ENDPOINTS.auth.login}`;
        console.log("Calling API:", loginUrl);

        try {
          const res = await axios.post(
            loginUrl,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              // Optional but recommended
              headers: { "Content-Type": "application/json" },
              timeout: 10000,
            }
          );

          console.log("LOGIN RESPONSE status:", res.status);
          console.log("LOGIN RESPONSE data:", JSON.stringify(res.data, null, 2));

          const data = res.data;

          // Adjust this condition to match your real API response
          if (
            res.status !== 200 ||
            !data?.success ||
            !data?.data?.accessToken ||
            !data?.data?.user
          ) {
            console.log("❌ API response did not pass validation");
            console.log("success:", data?.success);
            console.log("accessToken exists:", !!data?.data?.accessToken);
            console.log("user exists:", !!data?.data?.user);
            return null;
          }

          const { accessToken, user } = data.data;

          console.log("✅ Authorize success for user:", user.email);

          return {
            id: String(user.id),          // must be string
            name: user.fullName,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            accessToken,
          };
        } catch (error: any) {
          console.error("=== AUTHORIZE ERROR ===");
          console.error("Message:", error.message);
          console.error("Status:", error.response?.status);
          console.error("Response data:", error.response?.data);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fullName = (user as any).fullName;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).fullName = token.fullName;
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // helpful while debugging
};

export default authOptions;