# Stack Research

**Domain:** 연구실 홈페이지 실적 구조 개편 — 콘텐츠 공개/비공개 분기 + 역할 기반 접근 제어
**Researched:** 2026-03-15
**Confidence:** HIGH (existing stack confirmed; patterns verified against official Supabase and Next.js docs)

---

## Context

This is NOT a new-stack decision. The base stack (Next.js 16, Supabase, Tailwind CSS v4) is fixed.
This document covers only the **patterns and APIs** needed for the three new capabilities:

1. `is_public` 콘텐츠 공개/비공개 분기
2. `lib/permissions/` 역할 기반 접근 제어
3. 과제 → 결과물 연결 UI의 데이터 레이어

---

## Recommended Stack

### Core Technologies

| Technology                                 | Version               | Purpose                                                            | Why Recommended                                                                                             |
| ------------------------------------------ | --------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Supabase RLS (Row Level Security)          | Built-in (PostgreSQL) | `is_public` 필드 기반 공개/비공개 접근 제어를 DB 레벨에서 강제     | anon 롤과 authenticated 롤을 분기하는 RLS 정책이 가장 안전한 단일 제어점. 앱 코드 버그가 있어도 DB가 막아줌 |
| `@supabase/ssr` 0.9.0                      | 이미 설치됨           | 서버 컴포넌트와 Server Actions에서 인증된 Supabase 클라이언트 생성 | `getUser()` (서버 전용)만 신뢰 가능 — `getSession()`은 서버에서 사용 금지 (Supabase 공식 경고)              |
| Next.js Server Actions                     | Next.js 16 내장       | 모든 쓰기 작업의 권한 검사 실행 지점                               | 서버에서만 실행 보장. 권한 검사를 action 진입점에 두면 UI 우회 불가                                         |
| PostgreSQL `user_metadata` / custom claims | Supabase 내장         | 사용자 역할(member/professor/admin)을 JWT에 포함                   | RLS 정책과 서버 코드 모두에서 동일한 역할 데이터를 사용 가능                                                |

### Supporting Libraries

| Library | Version | Purpose                    | When to Use                                                                                                                  |
| ------- | ------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `zod`   | ^3.x    | Server Actions 입력값 검증 | FormData 파싱 시 타입 안전성 확보. 현재 codebase에 검증 라이브러리 없음 — Server Action에 권한 + 입력 검증 동시 추가 시 필요 |
| (없음)  | —       | RBAC 전용 외부 라이브러리  | Clerk, Permify, Casbin 불필요. 역할이 3개(member/professor/admin)뿐이라 `lib/permissions/` 유틸 함수로 충분                  |

### Development Tools

| Tool                              | Purpose                                                  | Notes                                                           |
| --------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| Supabase CLI                      | 마이그레이션 관리 (`is_public` 컬럼 추가, RLS 정책 작성) | `frontend/supabase/migrations/` 디렉터리에 SQL 파일로 버전 관리 |
| Supabase Dashboard → Auth → Roles | JWT custom claims 확인                                   | `auth.jwt() -> 'user_metadata' -> 'role'` 경로 검증용           |

---

## Key Pattern Decisions

### 1. is_public 콘텐츠 분기 — RLS + 쿼리 레이어 이중 방어

**패턴: DB 레벨 RLS + 쿼리 함수 명시적 필터 동시 적용**

RLS 정책 (SQL):

```sql
-- publications 테이블 예시
CREATE POLICY "Public can read public publications"
  ON publications FOR SELECT
  TO anon
  USING (is_public = true);

CREATE POLICY "Authenticated can read all publications"
  ON publications FOR SELECT
  TO authenticated
  USING (true);
```

쿼리 레이어 (`lib/queries/publications.ts`):

```typescript
// 공개 포털 쿼리 — anon 클라이언트 사용, RLS가 자동 필터
export async function getPublicPublications() {
  const supabase = createStaticClient(); // anon key 클라이언트
  const { data } = await supabase.from("publications").select("*");
  return data;
}

// 내부 포털 쿼리 — authenticated 클라이언트, 전체 노출
export async function getAllPublications() {
  const supabase = await createServerClient(); // session 기반 클라이언트
  const { data } = await supabase.from("publications").select("*");
  return data;
}
```

**왜 이중으로 하는가:** RLS는 최후 방어선. 쿼리 함수에서도 의도를 명시하면 코드 가독성과 감사(audit)가 쉬워짐.

---

### 2. lib/permissions/ 구현 — 중앙화된 역할 검사 유틸

**패턴: 얇은 유틸 함수 모음 (외부 라이브러리 없음)**

```typescript
// lib/permissions/roles.ts
type Role = "member" | "professor" | "admin";

export async function getCurrentUserRole(): Promise<Role | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser(); // getSession() 금지
  return (user?.user_metadata?.role as Role) ?? null;
}

export function canEdit(role: Role | null): boolean {
  return role === "professor" || role === "admin";
}

export function requireRole(role: Role | null, required: Role[]): void {
  if (!role || !required.includes(role)) {
    throw new Error("Unauthorized");
  }
}
```

Server Action에서 사용:

```typescript
// actions/publications.ts
export async function createPublication(formData: FormData) {
  "use server";
  const role = await getCurrentUserRole();
  requireRole(role, ["professor", "admin"]); // 진입점에서 즉시 검사
  // ... 이후 로직
}
```

**왜 middleware에서 하지 않는가:** Next.js 공식 문서는 "middleware의 역할 검사는 UX 목적, 실제 보안은 Server Action/Server Component에서 하라"고 명시. middleware는 세션 갱신(현재 구조)에 집중.

---

### 3. 과제 → 결과물 연결 — JOIN 쿼리 패턴

**패턴: Supabase 중간 테이블 JOIN을 쿼리 함수에서 처리**

```typescript
// lib/queries/projects.ts
export async function getProjectWithOutputs(slug: string) {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_publications(publications(*)),
      project_patents(patents(*)),
      project_software(software(*))
    `,
    )
    .eq("slug", slug)
    .single();
  return data;
}
```

**왜 별도 API route를 만들지 않는가:** 현재 아키텍처가 API route 없이 Server Components에서 직접 쿼리하는 패턴. 일관성 유지가 중요.

---

## Alternatives Considered

| Recommended                    | Alternative                                 | When to Use Alternative                                            |
| ------------------------------ | ------------------------------------------- | ------------------------------------------------------------------ |
| Supabase RLS로 is_public 강제  | 앱 코드에서만 `.eq('is_public', true)` 필터 | 절대 사용 금지. 쿼리 누락 시 전체 노출 위험                        |
| `lib/permissions/` 유틸 함수   | Clerk RBAC, Permify                         | 역할이 5개 이상이거나 동적 권한 위임이 필요한 경우                 |
| `auth.getUser()` 서버 호출     | `auth.getSession()` 서버 호출               | `getSession()`은 클라이언트 사이드에서만 사용 (Supabase 공식 경고) |
| Server Action 진입점 권한 검사 | middleware에서 역할별 경로 차단             | 외부 서비스/API 통합이 있어 middleware 차단이 필요한 경우          |

---

## What NOT to Use

| Avoid                                                     | Why                                                                                                                     | Use Instead                                          |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `supabase.auth.getSession()` in Server Components/Actions | 서버에서는 JWT 검증 없이 쿠키를 그대로 반환 — 위조 가능. Supabase 공식 문서 명시                                        | `supabase.auth.getUser()` — 서버에서 JWT 재검증 수행 |
| Middleware에서만 역할 검사                                | Next.js 공식 문서: "middleware는 보조적 UX 체크, 보안 게이트 아님" — Server Actions/API routes는 middleware를 우회 가능 | Server Action 진입점에서 `requireRole()` 호출        |
| Clerk, NextAuth, Auth0 추가                               | 이미 Supabase Auth로 완전히 구현됨. 두 auth 시스템 공존은 세션 충돌 유발                                                | Supabase Auth 유지                                   |
| `user_roles` 별도 DB 테이블 생성                          | 현재 `user_metadata.role` 패턴으로 충분. 추가 JOIN 복잡도만 증가                                                        | `user_metadata` + `auth.getUser()`                   |
| Zod 없이 FormData 직접 타입캐스팅                         | 현재 actions/에 검증 없음 — Server Action에 권한 검사 추가하는 김에 Zod도 함께 도입 권장                                | `zod` + `safeParse()`                                |

---

## Stack Patterns by Variant

**공개 포털 페이지 (public route group):**

- `createStaticClient()` 사용 (anon key)
- RLS가 `is_public = true` 행만 반환
- 권한 검사 불필요 — DB가 처리

**내부 포털 페이지 (internal route group):**

- `createServerClient()` 사용 (session 기반)
- RLS authenticated 정책 적용 — 전체 접근
- Layout에서 세션 유무만 검사

**교수 관리 포털 (professor route group) Server Actions:**

- `createServerClient()` + `auth.getUser()` 로 역할 확인
- `requireRole(role, ['professor', 'admin'])` 첫 번째 줄에서 호출
- 역할 미충족 시 `throw new Error('Unauthorized')` — redirect는 Server Action에서 불가, 호출 측에서 처리

---

## Version Compatibility

| Package                        | Compatible With        | Notes                                                                      |
| ------------------------------ | ---------------------- | -------------------------------------------------------------------------- |
| `@supabase/supabase-js` 2.98.0 | `@supabase/ssr` 0.9.0  | 현재 설치 버전 — 호환 확인됨                                               |
| Next.js 16.1.6                 | `@supabase/ssr` 0.9.0  | `createServerClient` cookie 전략이 Next.js App Router cookies() API와 호환 |
| Zod ^3.x                       | TypeScript strict mode | strict mode 환경에서 완전 동작                                             |

---

## Installation

```bash
# 신규 설치 필요한 패키지 (Supabase/Next.js는 이미 설치됨)
cd frontend
pnpm add zod
```

---

## Sources

- [Supabase Row Level Security Docs](https://supabase.com/docs/guides/database/postgres/row-level-security) — anon/authenticated 역할 분기 RLS 패턴 (HIGH confidence)
- [Supabase Setting up Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) — `getUser()` vs `getSession()` 서버 사용 경고 (HIGH confidence)
- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication) — middleware는 보조, Server Actions에서 실제 권한 검사 권고 (HIGH confidence)
- [Supabase RLS Simplified Guide](https://supabase.com/docs/guides/troubleshooting/rls-simplified-BJTcS8) — is_public 패턴 적용 방법 (HIGH confidence)
- [Next.js RBAC with App Router - jigz.dev](https://www.jigz.dev/blogs/how-to-implement-role-based-access-control-rbac-in-next-js-app-router) — lib/permissions 중앙화 패턴 (MEDIUM confidence — community source, Next.js 공식 문서로 검증됨)

---

_Stack research for: 연구실 홈페이지 실적 구조 개편_
_Researched: 2026-03-15_
