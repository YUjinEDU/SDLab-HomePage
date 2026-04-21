import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/drizzle";
import { users, members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );
        if (!isValid) return null;

        let nasFolderName: string | null = null;
        if (user.memberId) {
          const [member] = await db
            .select({ nasFolderName: members.nasFolderName })
            .from(members)
            .where(eq(members.id, user.memberId))
            .limit(1);
          nasFolderName = member?.nasFolderName ?? null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          memberId: user.memberId,
          nasFolderName,
        };
      },
    }),
  ],
});
