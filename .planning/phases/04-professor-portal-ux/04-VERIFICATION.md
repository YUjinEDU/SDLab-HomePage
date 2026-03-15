---
phase: 04-professor-portal-ux
verified: 2026-03-15T00:00:00Z
status: human_needed
score: 7/7 must-haves verified
human_verification:
  - test: "Professor publications page: all items visible + toggle works end-to-end"
    expected: "All publications (including is_public=false) appear. Each row has a clickable 공개/비공개 badge. Clicking flips optimistically and public-facing page reflects change after revalidation."
    why_human: "Cache revalidation and public-page propagation require a live browser session with real Supabase data."
  - test: "Professor patents page: toggle works"
    expected: "Same behavior as publications page — patents use the publications table filtered by type."
    why_human: "Same reason as above."
  - test: "Professor projects page: all items visible + toggle works end-to-end"
    expected: "All projects (including is_public=false) appear. Toggle flips state optimistically and public-facing page reflects change."
    why_human: "Requires live Supabase session to confirm DB write and cache bust."
---

# Phase 4: Professor Portal UX — Visibility Management Verification Report

**Phase Goal:** 교수님이 코드 또는 DB 직접 접근 없이 포털에서 각 항목의 공개 여부를 관리할 수 있다
**Verified:** 2026-03-15
**Status:** human_needed (all automated checks passed)
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                  | Status   | Evidence                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | togglePublicationVisibility updates is_public in publications table and revalidates 'publications' tag | VERIFIED | visibility.ts L15-24: supabase.from("publications").update({is_public}).eq("id"), revalidateTag("publications") |
| 2   | toggleProjectVisibility updates is_public in projects table and revalidates 'projects' tag             | VERIFIED | visibility.ts L27-41: supabase.from("projects").update({is_public}).eq("id"), revalidateTag("projects")         |
| 3   | Both actions block callers without professor or admin role                                             | VERIFIED | visibility.ts L11-12 & L28-29: assertRole("professor") checked before any DB operation                          |
| 4   | Publication and Project TypeScript types expose isPublic: boolean                                      | VERIFIED | publication.ts L28: `isPublic: boolean`; projects.ts L44: `isPublic: (row.is_public as boolean) ?? false`       |
| 5   | getAllProjects (uncached) returns all projects including is_public=false                               | VERIFIED | projects.ts L145: `export async function getAllProjects()` with no is_public filter                             |
| 6   | Professor publications/patents pages show all items with VisibilityToggleButton per row                | VERIFIED | publications/page.tsx imports getAllPublications + VisibilityToggleButton; patents/page.tsx same pattern        |
| 7   | Professor projects page shows all items with VisibilityToggleButton per row                            | VERIFIED | projects/page.tsx imports getAllProjects + VisibilityToggleButton + toggleProjectVisibility                     |

**Score:** 7/7 truths verified (automated)

### Required Artifacts

| Artifact                                                       | Expected                                                            | Status   | Details                                                                                |
| -------------------------------------------------------------- | ------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| `frontend/src/actions/visibility.ts`                           | togglePublicationVisibility, toggleProjectVisibility Server Actions | VERIFIED | 43 lines, both exports present with assertRole + DB update + revalidateTag             |
| `frontend/src/actions/visibility.test.ts`                      | vitest unit tests                                                   | VERIFIED | 135 lines, substantive — mocks supabase/next/cache/permissions with vi.hoisted pattern |
| `frontend/src/types/publication.ts`                            | Publication type with isPublic: boolean                             | VERIFIED | Line 28: `isPublic: boolean` present                                                   |
| `frontend/src/lib/queries/projects.ts`                         | getAllProjects uncached + isPublic in toProject mapper              | VERIFIED | L44: isPublic mapping; L145: getAllProjects export                                     |
| `frontend/src/components/professor/VisibilityToggleButton.tsx` | use client toggle with optimistic state + useTransition             | VERIFIED | 52 lines, useState + useTransition, optimistic flip + revert on error                  |
| `frontend/src/app/(professor)/professor/publications/page.tsx` | getAllPublications + VisibilityToggleButton per row                 | VERIFIED | Imports and renders VisibilityToggleButton at L80-83                                   |
| `frontend/src/app/(professor)/professor/patents/page.tsx`      | getAllPublications + VisibilityToggleButton per row                 | VERIFIED | Imports and renders VisibilityToggleButton at L62-65                                   |
| `frontend/src/app/(professor)/professor/projects/page.tsx`     | getAllProjects + VisibilityToggleButton per row                     | VERIFIED | Imports and renders VisibilityToggleButton at L91-94                                   |

### Key Link Verification

| From                            | To                                                    | Via                                                       | Status | Details                                    |
| ------------------------------- | ----------------------------------------------------- | --------------------------------------------------------- | ------ | ------------------------------------------ |
| visibility.ts                   | lib/permissions assertRole                            | `assertRole("professor")` import                          | WIRED  | L5 import, L11 & L28 call                  |
| visibility.ts                   | next/cache revalidateTag                              | revalidateTag('publications') / revalidateTag('projects') | WIRED  | L4 import, L23 & L40 call                  |
| projects.ts toProject           | Project type isPublic field                           | `isPublic: (row.is_public as boolean) ?? false`           | WIRED  | L44 confirmed                              |
| professor/publications/page.tsx | getAllPublications query                              | import getAllPublications (uncached)                      | WIRED  | L2 import, L16 call                        |
| professor/projects/page.tsx     | getAllProjects query                                  | import getAllProjects (uncached)                          | WIRED  | L2 import, L22 call                        |
| VisibilityToggleButton          | togglePublicationVisibility / toggleProjectVisibility | toggle prop passed from page                              | WIRED  | All three pages pass action as toggle prop |

### Requirements Coverage

| Requirement | Source Plan  | Description                                                       | Status    | Evidence                                                                                                   |
| ----------- | ------------ | ----------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| VIS-03      | 04-01, 04-02 | 교수 포털에서 각 항목의 is_public 토글 UI 제공 (논문, 특허, 과제) | SATISFIED | VisibilityToggleButton wired into all three professor pages; Server Actions update DB and revalidate cache |

### Anti-Patterns Found

None detected. No TODOs, FIXMEs, placeholders, or empty return stubs found in any phase artifact.

### Human Verification Required

#### 1. Publications Page End-to-End Toggle

**Test:** Log in as professor/admin, visit `/professor/publications`. Verify all publications appear (including private). Click a "공개" badge.
**Expected:** Badge flips to "비공개" immediately (optimistic). Public `/publications` page no longer shows the item after revalidation.
**Why human:** Cache revalidation propagation and Supabase DB write require a live authenticated session.

#### 2. Patents Page End-to-End Toggle

**Test:** Visit `/professor/patents`. Click a toggle badge.
**Expected:** Same behavior — patents share the publications table, toggled via togglePublicationVisibility.
**Why human:** Same as above.

#### 3. Projects Page End-to-End Toggle

**Test:** Visit `/professor/projects`. Verify private projects are listed. Click a "비공개" badge.
**Expected:** Badge flips to "공개". Public `/projects` page reflects the change.
**Why human:** Same as above.

### Gaps Summary

No gaps found. All seven observable truths are satisfied by concrete, wired, substantive code. The phase goal is achieved at the code level: professors can manage visibility of publications, patents, and projects entirely within the portal without any DB or code access.

One human verification gate remains (per the plan's own blocking checkpoint): confirming the optimistic toggle and cache revalidation work correctly end-to-end in a live browser session.

---

_Verified: 2026-03-15_
_Verifier: Claude (gsd-verifier)_
