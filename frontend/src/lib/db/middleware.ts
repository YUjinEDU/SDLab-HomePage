import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/professor", "/internal"];

export async function updateSession(request: NextRequest) {
  // 쿠키 직접 확인 — Supabase SDK 호출 없음, 네트워크 0.
  // getSession()도 만료 시 refresh 요청(네트워크)을 보내므로 Edge 타임아웃 위험이 남음.
  // 미들웨어는 "로그인 여부 판단 → 리다이렉트"만 하면 되므로 쿠키 존재 여부로 충분.
  // 실제 JWT 검증 + role 체크는 각 레이아웃의 getSessionWithRole()/getUser()에서 처리.
  const hasSession = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));

  const isProtected = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 이미 로그인된 사용자가 로그인 페이지 접근 시 내부 포털로 리다이렉트
  // 역할별 세부 분기는 레이아웃(Server Component)에서 처리
  if (request.nextUrl.pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/internal", request.url));
  }

  return NextResponse.next({ request });
}
