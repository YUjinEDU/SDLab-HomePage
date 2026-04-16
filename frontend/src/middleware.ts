import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;

  const isProtectedInternal = nextUrl.pathname.startsWith("/internal");
  const isProfessorOnly = nextUrl.pathname.startsWith("/professor");

  if (isProtectedInternal && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${nextUrl.pathname}`, nextUrl)
    );
  }

  if (isProfessorOnly) {
    const role = (session?.user as any)?.role;
    if (!isLoggedIn || (role !== "professor" && role !== "admin")) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/internal/:path*", "/professor/:path*"],
};
