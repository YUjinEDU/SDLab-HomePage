import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";
import { locales, defaultLocale } from "@/i18n/config";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const { auth } = NextAuth(authConfig);

const localeRegex = new RegExp(`^/(${locales.join("|")})(/.+)?$`);

function stripLocale(pathname: string): string {
  const m = pathname.match(localeRegex);
  return m ? m[2] || "/" : pathname;
}

export default auth((req) => {
  // CVE-2025-29927 mitigation
  if (req.headers.has("x-middleware-subrequest")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { pathname } = req.nextUrl;
  const localeFree = stripLocale(pathname);
  const isLoggedIn = !!req.auth?.user;

  // /login은 locale 라우팅 없이 직접 처리 (auth route group)
  if (pathname === "/login" || localeFree === "/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/internal", req.url));
    }
    return NextResponse.next();
  }

  // /internal, /professor는 locale 라우팅 없이 직접 처리
  if (
    localeFree.startsWith("/internal") ||
    localeFree.startsWith("/professor")
  ) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)"],
};
