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
    return NextResponse.redirect(new URL(`/${defaultLocale}/login`, req.url));
  }

  const { pathname } = req.nextUrl;
  const localeFree = stripLocale(pathname);
  const isLoggedIn = !!req.auth?.user;

  if (
    (localeFree.startsWith("/internal") ||
      localeFree.startsWith("/professor")) &&
    !isLoggedIn
  ) {
    const loginUrl = new URL(`/${defaultLocale}/login`, req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (localeFree === "/login" && isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}/internal`, req.url),
    );
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)"],
};
