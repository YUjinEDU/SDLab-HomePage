import type { NextAuthConfig } from "next-auth";

// Edge-compatible config: no bcryptjs, no DB imports
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const u = user as { role: "member" | "professor" | "admin"; memberId: number | null; nasFolderName: string | null };
        token.role = u.role;
        token.memberId = u.memberId;
        token.nasFolderName = u.nasFolderName;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      session.user.role = token.role;
      session.user.memberId = token.memberId;
      session.user.nasFolderName = token.nasFolderName;
      return session;
    },
  },
};
