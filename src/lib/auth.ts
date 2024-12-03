import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "./prisma";

export const { auth, signIn, handlers, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const check =
          profile?.email_verified && profile.email?.endsWith("@gmail.com");
        return check ? true : false;
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      try {
        await prisma.cart.create({
          data: {
            userId: user.id!,
          },
        });
      } catch (error) {
        console.error("Error creating cart for new user:", error);
      }
    },
  },
  pages: {
    signIn: "/signin",
  },
  trustHost: true,
});
