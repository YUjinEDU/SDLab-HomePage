import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/db/middleware";
import { locales, defaultLocale } from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const localeRegex = new RegExp(`^/(${locales.join("|")})(/.+)?$`);

function stripLocale(pathname: string): string {
  const m = pathname.match(localeRegex);
  return m ? m[2] || "/" : pathname;
}

export function middleware(request: NextRequest) {
  // CVE-2025-29927 mitigation
  if (request.headers.has("x-middleware-subrequest")) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}/login`, request.url),
    );
  }

  const { pathname } = request.nextUrl;
  const localeFree = stripLocale(pathname);

  // Protected & auth paths → Supabase session (locale-aware)
  if (
    localeFree.startsWith("/login") ||
    localeFree.startsWith("/internal") ||
    localeFree.startsWith("/professor") ||
    pathname.startsWith("/api")
  ) {
    return updateSession(request);
  }

  // Public paths → locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
