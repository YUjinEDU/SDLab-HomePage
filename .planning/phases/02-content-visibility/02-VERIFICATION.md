---
phase: 02-content-visibility
verified: 2026-03-15T12:00:00Z
status: passed
score: 5/5 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 3/5
  gaps_closed:
    - "비로그인 방문자가 /patents 상세 페이지에 접근할 수 있다 — patents/[slug]/page.tsx에서 AccessDenied 게이트 제거 확인"
    - "비로그인 방문자가 /projects 목록 및 상세 페이지에 접근할 수 있다 — 사용자 결정으로 VIS-01 범위 예외로 문서화, 검증 범위에서 제외"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "교수 포털에서 논문 하나의 is_public을 false로 변경 저장 후, 공개 /publications 페이지를 새 탭(비로그인)으로 즉시 확인"
    expected: "해당 논문이 즉시 목록에서 사라짐"
    why_human: "revalidateTag의 실제 캐시 무효화 타이밍은 Next.js 런타임 동작으로 정적 분석 불가"
---

# Phase 02: Content Visibility Verification Report

**Phase Goal:** 비로그인 방문자에게 is_public = false 콘텐츠가 노출되지 않고, 교수 포털에서 변경 시 즉시 반영된다
**Verified:** 2026-03-15
**Status:** passed
**Re-verification:** Yes — after gap closure (patents/[slug] fix + projects intentional-exception documented)

## Goal Achievement

### Observable Truths

| #   | Truth                                                             | Status     | Evidence                                                                                                                |
| --- | ----------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | 공개 쿼리가 is_public=true 행만 반환한다                          | ✓ VERIFIED | publications.ts, projects.ts 모든 public 함수에 `.eq("is_public", true)` 적용됨                                         |
| 2   | 공개 쿼리가 unstable_cache + 태그로 캐싱된다                      | ✓ VERIFIED | 모든 public 쿼리 함수가 `unstable_cache(…, { tags: ["publications"] })` 또는 `["projects"]`로 래핑됨                    |
| 3   | write action 후 revalidateTag로 캐시가 무효화된다                 | ✓ VERIFIED | publications.ts create/update/delete 모두 `revalidateTag("publications")`; projects.ts `revalidateTag("projects")` 호출 |
| 4   | 비로그인 방문자가 /publications 및 /patents 목록·상세에 접근 가능 | ✓ VERIFIED | publications/page.tsx, patents/page.tsx, patents/[slug]/page.tsx 모두 getSession 검사 없음                              |
| 5   | /projects 비공개 운영은 사용자 결정으로 VIS-01 범위 예외          | ✓ VERIFIED | memory/project_page_access_control.md에 명시적 문서화 — 데이터 정리 전까지 의도적 비공개                                |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact                                                     | Expected                        | Status     | Details                                                                                                                        |
| ------------------------------------------------------------ | ------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `frontend/src/lib/queries/publications.ts`                   | is_public 필터 + unstable_cache | ✓ VERIFIED | getPublications, getPublicationBySlug, getFeaturedPublications, getPatents, getPatentBySlug, getPublicationsByMember 모두 적용 |
| `frontend/src/lib/queries/projects.ts`                       | is_public 필터 + unstable_cache | ✓ VERIFIED | getProjects, getProjectBySlug, getFeaturedProjects, getActiveProjects, getDemoProjects, getProjectsByMember 모두 적용          |
| `frontend/src/actions/publications.ts`                       | revalidateTag("publications")   | ✓ VERIFIED | create/update/delete 3개 함수 모두 호출 (line 96, 199, 224)                                                                    |
| `frontend/src/actions/projects.ts`                           | revalidateTag("projects")       | ✓ VERIFIED | create/update/delete 3개 함수 모두 호출 (line 80, 158, 178)                                                                    |
| `frontend/src/app/(public)/[locale]/publications/page.tsx`   | AccessDenied 게이트 없음        | ✓ VERIFIED | getSession() 검사 없이 getPublications() 직접 호출                                                                             |
| `frontend/src/app/(public)/[locale]/patents/page.tsx`        | AccessDenied 게이트 없음        | ✓ VERIFIED | getSession() 검사 없이 getPatents() 직접 호출                                                                                  |
| `frontend/src/app/(public)/[locale]/patents/[slug]/page.tsx` | AccessDenied 게이트 없음        | ✓ VERIFIED | grep 결과 없음 — AccessDenied/getSession 제거 확인 (이전 gap 해소)                                                             |

### Key Link Verification

| From                      | To                   | Via                     | Status  | Details                                       |
| ------------------------- | -------------------- | ----------------------- | ------- | --------------------------------------------- |
| `actions/publications.ts` | `publications` cache | `revalidateTag`         | ✓ WIRED | create/update/delete 모두 호출                |
| `actions/projects.ts`     | `projects` cache     | `revalidateTag`         | ✓ WIRED | create/update/delete 모두 호출                |
| `queries/publications.ts` | DB                   | `.eq("is_public",true)` | ✓ WIRED | 모든 public 쿼리 함수에 필터 적용             |
| `queries/projects.ts`     | DB                   | `.eq("is_public",true)` | ✓ WIRED | 모든 public 쿼리 함수에 필터 적용             |
| `publications/page.tsx`   | `getPublications()`  | 직접 호출               | ✓ WIRED | 게이트 없음, anon 접근 가능                   |
| `patents/page.tsx`        | `getPatents()`       | 직접 호출               | ✓ WIRED | 게이트 없음, anon 접근 가능                   |
| `patents/[slug]/page.tsx` | `getPatentBySlug()`  | 직접 호출               | ✓ WIRED | 게이트 제거됨, anon 접근 가능 (이전 gap 해소) |

### Requirements Coverage

| Requirement | Description                               | Status      | Evidence                                                                                                |
| ----------- | ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| VIS-01      | 공개 쿼리 함수에 is_public=true 필터 적용 | ✓ SATISFIED | 쿼리 레이어 완전 구현 + publications/patents 공개 페이지 접근 가능. /projects 비공개는 사용자 결정 예외 |
| VIS-02      | revalidateTag() 태그 기반 캐시 무효화     | ✓ SATISFIED | 모든 write action(publications, projects)에서 호출 확인                                                 |

### Anti-Patterns Found

없음 — 이전 blocker(patents/[slug] AccessDenied 게이트) 해소 확인.

**참고:** /projects AccessDenied 게이트는 `memory/project_page_access_control.md`에 명시적으로 의도된 운영 결정으로 문서화되어 있음. VIS-01 예외 범위로 처리.

### Human Verification Required

### 1. 캐시 무효화 즉시 반영 확인

**Test:** 교수 포털에서 논문 하나의 is_public을 false로 변경 저장 후, 공개 /publications 페이지를 새 탭(비로그인)으로 즉시 확인
**Expected:** 해당 논문이 즉시 목록에서 사라짐
**Why human:** revalidateTag의 실제 캐시 무효화 타이밍은 Next.js 런타임 동작으로 정적 분석 불가

---

_Verified: 2026-03-15_
_Verifier: Claude (gsd-verifier)_
