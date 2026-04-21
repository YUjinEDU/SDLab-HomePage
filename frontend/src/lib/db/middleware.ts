import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/professor", "/internal"];
const DEFAULT_LOCALE = "ko";

function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(ko|en)(\/.*)?$/);
  return m ? m[2] || "/" : pathname;
}

// 청크 쿠키 포함 검사: 대형 JWT는 sb-<ref>-auth-token.0, .1 ... 으로 분할됨
function hasSbAuthCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some(
      (c) =>
        c.name.startsWith("sb-") &&
        (c.name.endsWith("-auth-token") || c.name.includes("-auth-token.")),
    );
}

export function updateSession(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const localeFree = stripLocale(pathname);
  const hasAuth = hasSbAuthCookie(request);

  // 쿠키가 없으면 즉시 리다이렉트 (네트워크 0, Edge-safe)
  if (PROTECTED_PATHS.some((p) => localeFree.startsWith(p)) && !hasAuth) {
    const loginUrl = new URL(`/${DEFAULT_LOCALE}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 로그인된 사용자가 /login 접근 시 내부 포털로 리다이렉트
  if (localeFree === "/login" && hasAuth) {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}/internal`, request.url),
    );
  }

  return NextResponse.next({ request });
}
