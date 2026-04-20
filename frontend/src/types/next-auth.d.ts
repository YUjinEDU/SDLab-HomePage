import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "member" | "professor" | "admin";
      memberId: number | null;
      nasFolderName: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "member" | "professor" | "admin";
    memberId: number | null;
    nasFolderName: string | null;
  }
}
