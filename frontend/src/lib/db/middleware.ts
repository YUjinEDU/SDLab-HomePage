import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/professor", "/internal"];

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
    console.error(
      "CRITICAL: NEXT_PUBLIC_SUPABASE_URL is missing or invalid. " +
        "Set this environment variable before starting the server. " +
        "See .env.example for required variables.",
    );
    return new NextResponse(
      "Service Unavailable: Database configuration error",
      {
        status: 503,
      },
    );
  }

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
    data: { user },
  } = await supabase.auth.getUser();

  // 보호된 경로 접근 시 로그인 필요
  const isProtected = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 이미 로그인된 사용자가 로그인 페이지 접근 시 내부 포털로 리다이렉트
  // 역할별 세부 분기는 레이아웃(Server Component)에서 처리 — 미들웨어 DB 조회 제거
  if (request.nextUrl.pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/internal", request.url));
  }

  return supabaseResponse;
}
