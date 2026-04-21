import createIntlMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";
import { locales, defaultLocale } from "@/i18n/config";
import { NextResponse, type NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest & { auth?: { user?: { role?: string } } | null }) => {
  const { nextUrl } = req;
  const session = (req as { auth?: { user?: { role?: string } } | null }).auth;
  const isLoggedIn = !!session?.user;

  const isProtectedInternal = nextUrl.pathname.startsWith("/internal");
  const isProfessorOnly = nextUrl.pathname.startsWith("/professor");

  if (isProtectedInternal && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(nextUrl.pathname)}`, nextUrl)
    );
  }

  if (isProfessorOnly) {
    const role = session?.user?.role;
    if (!isLoggedIn || (role !== "professor" && role !== "admin")) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  }

  return intlMiddleware(req);
});

export const config = {
  // next-intl이 필요한 모든 경로 포함, API/static 제외
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)"],
};
