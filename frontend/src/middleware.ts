import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/db/middleware";
import { locales, defaultLocale } from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export async function middleware(request: NextRequest) {
  // CVE-2025-29927 mitigation: block internal subrequest header abuse
  // Attackers can inject this header to bypass middleware auth entirely.
  // Defense-in-depth: block even if Next.js version already patches internally.
  if (request.headers.has("x-middleware-subrequest")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { pathname } = request.nextUrl;

  // Non-public paths → Supabase session only (no locale routing)
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/internal") ||
    pathname.startsWith("/professor") ||
    pathname.startsWith("/api")
  ) {
    return await updateSession(request);
  }

  // Public paths → locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
