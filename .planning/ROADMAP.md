# Roadmap: SD Lab Homepage — 실적 구조 개편

## Overview

보안 기반 구축(권한 유틸 + DB 스키마)에서 시작하여 공개/비공개 가시성 제어, 과제-결과물 양방향 연결, 교수 포털 관리 UX 순으로 전달한다. 각 단계는 이전 단계의 결과물에 의존하는 선형 의존 구조이며, 방문자가 "이 과제에서 무엇이 나왔는지"를 한눈에 파악하는 것이 최종 목표다.

## Phases

- [ ] **Phase 1: Security Foundation** - 권한 유틸 구현 + DB 스키마(is_public + RLS) + CVE 패치
- [ ] **Phase 2: Content Visibility** - 공개 쿼리에 is_public 필터 적용 + 캐시 무효화
- [ ] **Phase 3: Project–Output Linking** - 과제-결과물 양방향 연결 UI + 모바일 반응형
- [ ] **Phase 4: Professor Portal UX** - 교수 포털 is_public 토글 UI + CRUD 권한 검증

## Phase Details

### Phase 1: Security Foundation

**Goal**: 모든 쓰기 작업이 역할 검사로 보호되고 DB에 is_public 컬럼과 RLS 정책이 존재한다
**Depends on**: Nothing (first phase)
**Requirements**: SEC-01, SEC-02, SEC-03, DB-01, DB-02, DB-03
**Success Criteria** (what must be TRUE):

1. `lib/permissions/index.ts`의 `assertRole()`을 Server Action 첫 줄에서 호출하면 미인가 역할 접근이 차단된다
2. `member` 역할 사용자가 professor/admin 전용 Server Action을 직접 호출하면 권한 오류가 반환된다
3. `publications`, `patents`, `projects` 테이블에 `is_public` 컬럼이 존재하고 기본값이 true다
4. Supabase anon 키로 직접 REST API를 호출해도 `is_public = false` 행이 반환되지 않는다
5. Next.js CVE-2025-29927 패치가 적용되어 `x-middleware-subrequest` 헤더로 미들웨어를 우회할 수 없다

**Plans**: 4 plans

Plans:

- [ ] 01-01-PLAN.md — lib/permissions assertRole/requireRole (TDD)
- [ ] 01-02-PLAN.md — Migration 004: is_public columns + RLS policies + RPC function
- [ ] 01-03-PLAN.md — Apply assertRole to all professor/admin Server Actions + professor layout
- [ ] 01-04-PLAN.md — CVE-2025-29927 middleware patch + human verification

### Phase 2: Content Visibility

**Goal**: 비로그인 방문자에게 is_public = false 콘텐츠가 노출되지 않고, 교수 포털에서 변경 시 즉시 반영된다
**Depends on**: Phase 1
**Requirements**: VIS-01, VIS-02
**Success Criteria** (what must be TRUE):

1. 로그인하지 않은 방문자가 논문/특허/과제 목록을 열면 `is_public = false` 항목이 보이지 않는다
2. 교수 포털에서 항목을 비공개로 변경한 직후 공개 페이지를 새로고침하면 해당 항목이 사라진다
3. 내부 포털에서는 is_public 여부와 관계없이 모든 항목이 표시된다
   **Plans**: TBD

### Phase 3: Project–Output Linking

**Goal**: 방문자가 과제 상세 페이지에서 연결된 논문·특허를 확인하고, 논문·특허 상세에서 연계 과제로 이동할 수 있다
**Depends on**: Phase 2
**Requirements**: LINK-01, LINK-02, LINK-03, MOB-01, MOB-02
**Success Criteria** (what must be TRUE):

1. 과제 상세 페이지에 연결된 논문과 특허 카드가 섹션으로 표시된다
2. 논문/특허 상세 페이지에 "연계 과제" 링크가 표시되고 클릭하면 해당 과제 상세로 이동한다
3. 모바일(375px)에서 실적 카드 목록이 가로 넘침 없이 정상 렌더링된다
   **Plans**: TBD

### Phase 4: Professor Portal UX

**Goal**: 교수님이 코드 또는 DB 직접 접근 없이 포털에서 각 항목의 공개 여부를 관리할 수 있다
**Depends on**: Phase 3
**Requirements**: VIS-03
**Success Criteria** (what must be TRUE):

1. 교수 포털 논문/특허/과제 목록에 is_public 토글이 표시되고 클릭 한 번으로 전환된다
2. 토글 변경 후 공개 페이지에 즉시 반영된다 (캐시 무효화 연동)
   **Plans**: TBD

## Progress

**Execution Order:** 1 → 2 → 3 → 4

| Phase                     | Plans Complete | Status      | Completed |
| ------------------------- | -------------- | ----------- | --------- |
| 1. Security Foundation    | 0/4            | Not started | -         |
| 2. Content Visibility     | 0/TBD          | Not started | -         |
| 3. Project–Output Linking | 0/TBD          | Not started | -         |
| 4. Professor Portal UX    | 0/TBD          | Not started | -         |

---

_Roadmap created: 2026-03-15_
_Phase 1 planned: 2026-03-15_
