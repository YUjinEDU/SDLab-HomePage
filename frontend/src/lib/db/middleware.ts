import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/professor", "/internal"];

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

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 쿠키가 없으면 SDK 호출 없이 즉시 리다이렉트 (네트워크 0)
  if (
    PROTECTED_PATHS.some((p) => pathname.startsWith(p)) &&
    !hasSbAuthCookie(request)
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 쿠키 있는 경우: getSession()으로 토큰 갱신 처리.
  // getSession()은 토큰이 유효하면 쿠키만 읽음(네트워크 없음).
  // 만료된 경우에만 Supabase refresh endpoint 호출(~1시간에 1번).
  // 1200ms timeout으로 Edge 런타임 1500ms 제한 내 안전하게 유지.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { session },
  } = await Promise.race([
    supabase.auth.getSession(),
    new Promise<{ data: { session: null } }>((resolve) =>
      setTimeout(() => resolve({ data: { session: null } }), 1200),
    ),
  ]);

  // 로그인된 사용자가 /login 접근 시 내부 포털로 리다이렉트
  // 역할별 세부 분기는 레이아웃에서 처리
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/internal", request.url));
  }

  return supabaseResponse;
}
