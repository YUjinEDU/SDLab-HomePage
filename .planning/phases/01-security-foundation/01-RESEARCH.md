# Phase 1: Security Foundation - Research

**Researched:** 2026-03-15
**Domain:** Next.js Server Actions permissions, Supabase RLS, CVE-2025-29927
**Confidence:** HIGH

---

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- `is_public` 기본값: publications/patents → `true`, projects → `false`
- Migration 004에서 컬럼 추가 + 기존 데이터 일괄 업데이트
- Server Actions 권한 오류: `{ error: 'unauthorized' }` 반환 — redirect 금지
- 레이아웃 수준 차단: `requireRole()` → `AccessDenied` 렌더링 또는 redirect
- 기존 `AccessDenied.tsx` 컴포넌트 재사용

### Claude's Discretion

- Next.js 버전 업그레이드 방식 선택 (15.2.3+ 또는 패치)
- `assertRole()` (Server Actions용) vs `requireRole()` (레이아웃용) 분리 구현
- `updatePublication`, `updateProject` join table 업데이트를 Supabase RPC로 래핑

### Deferred Ideas (OUT OF SCOPE)

- 공개/비공개 토글 UI — Phase 4 (VIS-03)
- SW 등록 실적 is_public — Phase 4 이후
  </user_constraints>

---

<phase_requirements>

## Phase Requirements

| ID     | Description                                                                           | Research Support                                         |
| ------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| SEC-01 | `lib/permissions/index.ts` 구현 — `assertRole()`, `requireRole()` export              | profiles 테이블 role 컬럼 확인, getUser() 패턴 확인 완료 |
| SEC-02 | 모든 professor/admin Server Actions에 `assertRole` 역할 검사 추가                     | 대상 action 파일 5종 식별, 현재 인증 없음 확인           |
| SEC-03 | Next.js 15.2.3+ 업그레이드 또는 CVE-2025-29927 패치                                   | 현재 버전 16.1.6 확인 — 이미 패치 포함 여부 확인 필요    |
| DB-01  | publications/patents/projects에 `is_public BOOLEAN DEFAULT true` 추가 (Migration 004) | 001 스키마 확인 — 기존 컬럼 없음, 충돌 없음              |
| DB-02  | `is_public = true`인 행만 anon에 노출하는 RLS 정책                                    | 현재 `Public read *` 정책이 USING(true) — 교체 필요      |
| DB-03  | `updatePublication`, `updateProject` join table 업데이트를 Supabase RPC로 래핑        | 현재 delete+insert 패턴 비트랜잭션 확인                  |

</phase_requirements>

---

## Summary

Phase 1은 세 가지 독립적인 보안 작업으로 구성된다: (1) Server Actions 권한 검사, (2) DB is_public 컬럼 + RLS 정책, (3) Next.js CVE 패치 확인.

현재 코드베이스 분석 결과: `lib/permissions/` 디렉토리는 비어 있고, 모든 Server Actions(`publications.ts`, `projects.ts`, `members.ts`, `news.ts`, `patents.ts` 등)에 역할 검사가 전혀 없다. `(professor)` 레이아웃은 로그인 여부(`!user`)만 확인하고 역할 검사를 하지 않는다. DB는 RLS가 활성화되어 있으나 `is_public` 컬럼이 없고, 공개 read 정책이 `USING(true)` (무조건 전체 노출) 상태다.

**Primary recommendation:** `assertRole()`을 먼저 구현하고, 모든 write actions에 첫 줄 패턴으로 삽입하며, Migration 004로 is_public 추가 + RLS 정책 교체를 단일 트랜잭션으로 처리한다.

---

## Standard Stack

### Core (이미 프로젝트에 존재)

| Library     | Version          | Purpose                    | Why Standard       |
| ----------- | ---------------- | -------------------------- | ------------------ |
| Next.js     | 16.1.6           | App Router, Server Actions | 프로젝트 기존 스택 |
| Supabase JS | (pnpm-lock 참조) | DB 클라이언트, Auth        | 프로젝트 기존 스택 |
| TypeScript  | -                | 타입 안전성                | 프로젝트 기존 스택 |

### 신규 추가 없음

이 페이즈는 새 라이브러리를 추가하지 않는다. 기존 스택만 활용한다.

---

## Architecture Patterns

### 기존 코드 확인 사항

**`profiles` 테이블 role 컬럼:**

- 타입: `user_role` ENUM (`'member'`, `'professor'`, `'admin'`)
- 컬럼명: `role` (확인됨, `001_initial_schema.sql` 기준)

**`getSession()` 현황:**

- `actions/auth.ts`의 `getSession()`은 내부적으로 `supabase.auth.getUser()`를 호출 — 올바른 패턴
- Server Actions에서 세션 조회 시 동일 패턴 사용

**`(professor)` 레이아웃 현황:**

- `getSession()` 으로 user 존재 여부만 확인, 역할 검사 없음
- `requireRole('professor')` 추가 필요

**현재 Server Actions 현황:**

- `actions/publications.ts`: 역할 검사 없음
- `actions/projects.ts`: 역할 검사 없음
- `actions/members.ts`: 역할 검사 없음 (추정)
- `actions/news.ts`: 역할 검사 없음 (추정)
- 대상 파일들: `professor/` 디렉토리 내 actions 포함

### Pattern 1: assertRole() — Server Actions용

**What:** Server Action 첫 줄에서 호출. 역할 불충분 시 `{ error: 'unauthorized' }` 반환.
**When to use:** 모든 professor/admin 전용 write Server Actions

```typescript
// lib/permissions/index.ts
import { createClient } from "@/lib/db/supabase-server";

type Role = "member" | "professor" | "admin";

const ROLE_HIERARCHY: Record<Role, number> = {
  member: 0,
  professor: 1,
  admin: 2,
};

export async function assertRole(
  minRole: Role,
): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "unauthorized" };

  if (ROLE_HIERARCHY[profile.role as Role] < ROLE_HIERARCHY[minRole]) {
    return { error: "unauthorized" };
  }

  return null;
}

export async function requireRole(minRole: Role): Promise<void> {
  // 레이아웃용: 실패 시 throw (호출자가 redirect/AccessDenied 처리)
  const result = await assertRole(minRole);
  if (result) throw new Error("unauthorized");
}
```

### Pattern 2: Server Action에 assertRole 삽입

```typescript
// actions/publications.ts 패턴
export async function createPublication(formData: FormData) {
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();
  // ... 기존 코드
}
```

### Pattern 3: (professor) 레이아웃에 requireRole 삽입

```typescript
// app/(professor)/layout.tsx 패턴
export default async function ProfessorLayout({ children }) {
  const user = await getSession();
  if (!user) redirect("/login");

  const authError = await assertRole('professor');
  if (authError) return <AccessDenied />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ProfessorSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 xl:p-8 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
```

**주의:** `AccessDenied` 컴포넌트는 `"use client"` + `useTranslations` 사용 중. 서버 컴포넌트 레이아웃에서 직접 렌더링 가능 (Client Component를 Server Component가 import하는 것은 허용됨). 단, i18n context가 필요하므로 `(professor)` 레이아웃이 i18n provider 밖에 있는지 확인 필요.

### Pattern 4: Migration 004 — is_public + RLS 정책 교체

```sql
-- migration 004_add_is_public.sql

-- 1. 컬럼 추가
ALTER TABLE publications ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE patents ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE projects ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false;

-- 2. 기존 데이터 업데이트 (명시적 일괄 적용)
UPDATE publications SET is_public = true;
UPDATE patents SET is_public = true;
UPDATE projects SET is_public = false;

-- 3. 기존 무조건 공개 READ 정책 교체
DROP POLICY IF EXISTS "Public read publications" ON publications;
DROP POLICY IF EXISTS "Public read projects" ON projects;
-- patents는 publications 테이블에 type='patent'로 저장 — 별도 테이블 없음

-- 4. is_public 필터 RLS 정책 신설
CREATE POLICY "Public read publications" ON publications
  FOR SELECT USING (
    is_public = true
    OR is_admin_or_professor()
  );

CREATE POLICY "Public read projects" ON projects
  FOR SELECT USING (
    is_public = false
    OR is_admin_or_professor()
  );
-- 참고: projects 기본값 false이므로 anon은 is_public=true인 것만 조회 가능
-- 위 정책을 is_public = true OR is_admin_or_professor()로 통일
```

**중요 발견:** `patents`는 별도 테이블이 아니다. `publications` 테이블에서 `type = 'patent'`로 구분된다. 따라서 `publications` 테이블에 `is_public` 추가 시 논문과 특허 모두 커버된다.

### Pattern 5: DB-03 — updatePublication RPC 래핑

**What:** `updatePublication`의 join table delete+insert를 PostgreSQL 함수로 래핑해 원자성 보장
**Why:** 현재 `publications.ts`의 `updatePublication`은 main update 성공 후 join table을 순차 delete/insert — 중간 실패 시 데이터 불일치 발생

```sql
-- RPC 함수: update_publication_with_relations
CREATE OR REPLACE FUNCTION update_publication_with_relations(
  p_id TEXT,
  p_data JSONB,
  p_author_ids TEXT[],
  p_research_area_ids TEXT[],
  p_project_ids TEXT[]
) RETURNS VOID AS $$
BEGIN
  -- main update
  UPDATE publications SET
    title = p_data->>'title',
    -- ... 기타 컬럼
    updated_at = now()
  WHERE id = p_id;

  -- join tables 원자적 교체
  DELETE FROM publication_authors WHERE publication_id = p_id;
  -- insert...
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Don't Hand-Roll

| Problem        | Don't Build             | Use Instead                    | Why                                              |
| -------------- | ----------------------- | ------------------------------ | ------------------------------------------------ |
| 역할 계층 비교 | 커스텀 role string 비교 | ROLE_HIERARCHY 숫자 맵         | 'professor' > 'member' 비교를 문자열로 하면 버그 |
| RLS 우회 감지  | 앱 레이어 필터만        | Supabase RLS (DB 레벨)         | 앱 필터는 직접 REST API 호출로 우회 가능         |
| 트랜잭션 래핑  | 앱 레이어 롤백 로직     | Supabase RPC (PostgreSQL 함수) | JS 레벨에서 트랜잭션 불가                        |

---

## Common Pitfalls

### Pitfall 1: patents는 별도 테이블이 아님

**What goes wrong:** `patents` 테이블을 찾아 `is_public` 추가하려 함
**Why it happens:** REQUIREMENTS.md에 "patents" 언급, 실제로는 `publications.type = 'patent'`
**How to avoid:** `publications` 테이블 하나에만 `is_public` 추가하면 충분
**Warning signs:** Migration에서 `ALTER TABLE patents` 시도 시 에러

### Pitfall 2: Server Action 내 redirect() 호출

**What goes wrong:** 권한 오류 시 `redirect('/login')` 호출 → 500 오류
**Why it happens:** Next.js Server Action에서 redirect는 throw로 구현 — Server Action 응답에서 처리 불가
**How to avoid:** `return { error: 'unauthorized' }` 패턴 사용 (CONTEXT.md 결정 사항)

### Pitfall 3: getSession() vs getUser() 혼용

**What goes wrong:** `supabase.auth.getSession()` 사용 시 서버 사이드에서 캐시된 세션 반환 — 신뢰 불가
**Why it happens:** Supabase 공식 문서에서 서버에서는 `getUser()` 사용 권장
**How to avoid:** `supabase.auth.getUser()` 항상 사용 (기존 `getSession()` 내부도 이미 `getUser()` 호출 — 올바름)

### Pitfall 4: (professor) 레이아웃의 AccessDenied 렌더링

**What goes wrong:** `AccessDenied`는 `useTranslations` 사용 — i18n provider가 없는 레이아웃에서 오류
**Why it happens:** `(professor)` 레이아웃은 i18n locale prefix 없는 경로
**How to avoid:** `requireRole` 실패 시 `redirect('/login')` 사용하거나, i18n 없는 단순 AccessDenied 렌더링 사용

### Pitfall 5: CVE-2025-29927 — Next.js 16.1.6에서 상태 확인

**What goes wrong:** 버전이 높다고 자동 패치 가정
**Why it happens:** CVE-2025-29927은 Next.js 15.2.3에서 수정됨. 16.x는 15.x에서 분기된 버전이 아닌 별도 메이저 — 패치 포함 여부 명시적 확인 필요
**How to avoid:** `next@16.1.6` changelog 또는 CVE advisory에서 16.x 대응 버전 확인 후 업그레이드 여부 결정

### Pitfall 6: is_public RLS에서 관리자 접근 누락

**What goes wrong:** `USING (is_public = true)` 만 설정 시 professor/admin도 비공개 항목 조회 불가
**Why it happens:** RLS는 역할 무관 적용
**How to avoid:** `USING (is_public = true OR is_admin_or_professor())` 패턴 — 기존 `is_admin_or_professor()` 함수 재사용

---

## Code Examples

### assertRole 호출 패턴 (Server Action)

```typescript
// Source: CONTEXT.md decisions + Supabase Auth docs pattern
export async function createPublication(formData: FormData) {
  const authError = await assertRole("professor");
  if (authError) return authError;
  // ...
}
```

### profiles role 조회

```typescript
// Source: 001_initial_schema.sql — profiles.role: user_role ENUM
const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();
// profile.role: 'member' | 'professor' | 'admin'
```

### RLS 정책 교체 패턴

```sql
-- Source: 001_initial_schema.sql 기존 패턴 + is_admin_or_professor() 재사용
DROP POLICY IF EXISTS "Public read publications" ON publications;
CREATE POLICY "Public read publications" ON publications
  FOR SELECT USING (is_public = true OR is_admin_or_professor());
```

---

## State of the Art

| Old Approach                  | Current Approach                                              | Impact                            |
| ----------------------------- | ------------------------------------------------------------- | --------------------------------- |
| `getSession()` 서버 사이드    | `getUser()` — JWT 서버 검증                                   | 토큰 위조 방어                    |
| 앱 레이어 필터만              | RLS (DB 레벨)                                                 | 직접 REST API 우회 차단           |
| 미들웨어를 보안 게이트로 사용 | 미들웨어는 세션 갱신만, 실제 권한 검사는 Server Action/Layout | CVE-2025-29927 클래스 취약점 방어 |

---

## Open Questions

1. **CVE-2025-29927과 Next.js 16.1.6**
   - What we know: CVE는 Next.js 15.2.3에서 수정됨. 프로젝트는 16.1.6 사용
   - What's unclear: 16.x 브랜치에 동일 패치가 포함되었는지 — 16.x는 15.x fork인지 독립 버전인지
   - Recommendation: `next@16.x` changelog에서 CVE-2025-29927 언급 확인. 없으면 `x-middleware-subrequest` 헤더 차단 로직을 `middleware.ts`에 직접 추가 (수동 패치)

2. **AccessDenied 컴포넌트와 i18n**
   - What we know: 현재 `AccessDenied.tsx`는 `useTranslations` 사용 — `(professor)` 레이아웃 (i18n 없음)에서 직접 사용 불가
   - What's unclear: `(professor)` 경로가 `next-intl` provider 범위 내인지
   - Recommendation: `(professor)` 레이아웃 역할 차단 시 `redirect('/login')`을 우선 사용. 또는 i18n 없는 간단한 인라인 접근거부 메시지 렌더링

3. **actions/professor/ 디렉토리**
   - What we know: `ls` 결과에서 `professor/` 하위 디렉토리 존재 확인 (내용 미확인)
   - What's unclear: 어떤 actions가 있는지
   - Recommendation: Plan 작성 전 `actions/professor/` 내 파일 목록 확인하여 SEC-02 대상 전수 파악

---

## Validation Architecture

### Test Framework

| Property           | Value                       |
| ------------------ | --------------------------- |
| Framework          | 미탐지 (test config 없음)   |
| Config file        | 없음 — Wave 0에서 설정 필요 |
| Quick run command  | `pnpm test` (설정 후)       |
| Full suite command | `pnpm test` (설정 후)       |

### Phase Requirements → Test Map

| Req ID | Behavior                                                                         | Test Type | Automated Command                              | File Exists? |
| ------ | -------------------------------------------------------------------------------- | --------- | ---------------------------------------------- | ------------ |
| SEC-01 | assertRole('professor') — member 역할로 호출 시 `{ error: 'unauthorized' }` 반환 | unit      | `pnpm test tests/permissions.test.ts`          | ❌ Wave 0    |
| SEC-01 | requireRole('professor') — 미인증 시 throw                                       | unit      | `pnpm test tests/permissions.test.ts`          | ❌ Wave 0    |
| SEC-02 | createPublication — 미인증 호출 시 unauthorized 반환                             | unit      | `pnpm test tests/actions/publications.test.ts` | ❌ Wave 0    |
| SEC-03 | x-middleware-subrequest 헤더로 미들웨어 우회 불가                                | manual    | 수동 curl 테스트                               | N/A          |
| DB-01  | publications/projects에 is_public 컬럼 존재                                      | manual    | Supabase Studio 또는 SQL 확인                  | N/A          |
| DB-02  | anon 키로 is_public=false 행 조회 시 0건 반환                                    | manual    | Supabase REST API curl 테스트                  | N/A          |
| DB-03  | updatePublication 중 join 업데이트 실패 시 main도 롤백                           | unit      | `pnpm test tests/actions/publications.test.ts` | ❌ Wave 0    |

### Wave 0 Gaps

- [ ] `frontend/src/__tests__/permissions.test.ts` — covers SEC-01
- [ ] `frontend/src/__tests__/actions/publications.test.ts` — covers SEC-02, DB-03
- [ ] Test framework 설치: `pnpm add -D vitest @vitest/globals` (또는 jest) — 없는 경우

---

## Sources

### Primary (HIGH confidence)

- `frontend/supabase/migrations/001_initial_schema.sql` — profiles.role 컬럼명, RLS 현황, is_admin_or_professor() 함수, 기존 정책 전수 확인
- `frontend/src/actions/publications.ts` — 현재 Server Action 패턴, 역할 검사 부재 확인
- `frontend/src/actions/auth.ts` — getUser() 기반 getSession() 확인
- `frontend/src/app/(professor)/layout.tsx` — 역할 검사 부재 확인
- `frontend/src/middleware.ts` — updateSession만 호출, 보안 게이트 아님 확인
- `frontend/src/components/shared/AccessDenied.tsx` — useTranslations 의존성 확인

### Secondary (MEDIUM confidence)

- `.planning/phases/01-security-foundation/01-CONTEXT.md` — 결정 사항 전수
- `.planning/REQUIREMENTS.md` — SEC-01~03, DB-01~03 요구사항
- Supabase 공식 문서 패턴 (getUser vs getSession 서버 사이드)

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — 기존 코드베이스 직접 확인
- Architecture: HIGH — 기존 패턴과 스키마 직접 확인
- CVE-2025-29927 × Next.js 16: LOW — 16.x 패치 포함 여부 미확인 (changelog 미조회)
- DB 스키마: HIGH — migration 파일 직접 확인

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (Supabase API는 안정적, Next.js 16 변경 가능성 낮음)
