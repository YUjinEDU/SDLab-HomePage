# Phase 1: Security Foundation - Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

<domain>
## Phase Boundary

모든 Server Actions에 역할 검사를 추가하고, DB에 `is_public` 컬럼 및 Supabase RLS 정책을 추가하며, CVE-2025-29927 패치를 적용한다. 공개/비공개 UI나 콘텐츠 링킹은 이 페이즈 범위 밖이다.

</domain>

<decisions>
## Implementation Decisions

### is_public 마이그레이션 기본값

- 논문(`publications`), 특허(`patents`): `is_public = true` (기존 공개 상태 유지)
- 과제(`projects`): `is_public = false` (교수님 피드백 후 개별 공개 전환 예정)
- Migration 004에서 컬럼 추가 시 위 기본값으로 기존 데이터 일괄 업데이트

### 권한 오류 UX

- 이미 존재하는 `AccessDenied.tsx` 컴포넌트(`frontend/src/components/shared/AccessDenied.tsx`) 활용
- Server Actions는 에러 객체 반환 (`{ error: 'unauthorized' }`) — redirect 금지 (Server Action 내 redirect는 500 오류 유발)
- 레이아웃 수준에서 차단 시: `requireRole()` → `AccessDenied` 렌더링 또는 redirect

### CVE-2025-29927 패치

- Claude's Discretion: Next.js 버전 업그레이드 방식 선택 (15.2.3+)

### lib/permissions/ 구조

- Claude's Discretion: `assertRole()` (Server Actions용 — 에러 반환) vs `requireRole()` (레이아웃용 — redirect) 분리 구현
- `profiles.role` 컬럼명 확인 후 구현

### 트랜잭션 래핑 (DB-03)

- Claude's Discretion: `updatePublication`, `updateProject` join table 업데이트를 Supabase RPC로 래핑

</decisions>

<code_context>

## Existing Code Insights

### Reusable Assets

- `frontend/src/components/shared/AccessDenied.tsx`: 권한 오류 표시 컴포넌트 — 이미 존재, 재사용
- `frontend/src/lib/db/middleware.ts`: 현재 미들웨어 수준 세션 처리 — 보안 게이트 역할 금지 (Next.js 공식 문서)
- `frontend/src/actions/publications.ts`, `actions/projects.ts` 등: 역할 검사 추가 대상

### Established Patterns

- 역할: `member` / `professor` / `admin` 3단계
- Supabase 서버 클라이언트: `lib/db/supabase-server.ts` — `getUser()` 사용 필수 (`getSession()` 금지)
- `lib/permissions/` 디렉토리 존재하나 완전히 비어 있음

### Integration Points

- Migration 파일: `frontend/supabase/migrations/` — 003까지 존재, 004 신규 작성
- 기존 `is_admin_or_professor()` Supabase 함수: RLS 정책에서 재사용 가능
- `(professor)` 레이아웃: `requireRole` 추가 대상

</code_context>

<specifics>
## Specific Ideas

- 과제 `is_public = false` 기본값은 교수님 피드백 전 임시 조치 — Phase 4에서 토글 UI 제공 후 교수님이 직접 선택
- AccessDenied 컴포넌트를 professor/admin 전용 페이지 접근 차단에 일관되게 사용

</specifics>

<deferred>
## Deferred Ideas

- 공개/비공개 토글 UI — Phase 4 (VIS-03)
- SW 등록 실적 is_public — Phase 4 이후 (교수님 피드백 후)

</deferred>

---

_Phase: 01-security-foundation_
_Context gathered: 2026-03-15_
