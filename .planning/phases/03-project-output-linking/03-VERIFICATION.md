---
phase: 03-project-output-linking
verified: 2026-03-15T00:00:00Z
status: passed
score: 10/10 must-haves verified
human_verification:
  - test: "Mobile overflow at 375px on cards and ProjectOutputsSection"
    expected: "No horizontal scrollbar visible on PublicationCard, PatentCard, ProjectCard, and ProjectOutputsSection at 375px viewport"
    why_human: "CSS rendering behavior cannot be verified programmatically — requires browser DevTools"
  - test: "Bidirectional navigation flow"
    expected: "Visitor clicks project -> sees related publications -> clicks publication -> sees project backlink -> navigates back"
    why_human: "End-to-end navigation flow requires browser interaction"
  - test: "is_public=false project returns 404 for unauthenticated visitor"
    expected: "Direct URL access to a known is_public=false project slug shows Next.js 404 page"
    why_human: "Requires live Supabase RLS enforcement — cannot verify from static code alone"
note: "LINK-01 checkbox in REQUIREMENTS.md is still [ ] (pending) but implementation is fully present and tested. Minor doc inconsistency only — does not affect goal achievement."
---

# Phase 03: Project Output Linking — Verification Report

**Phase Goal:** Link project pages to their output publications and patents; fix mobile card overflow; make project pages publicly accessible with is_public filtering.
**Verified:** 2026-03-15
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                          | Status                                  | Evidence                                                                                                                                                         |
| --- | ---------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `getProjectOutputs(projectId)` returns only is_public=true publications linked to that project | VERIFIED                                | `publications.ts:156` — `.eq("is_public", true)` before `.in("id", pubIds)`; 5 unit tests in `publications.test.ts` describe block "LINK-01 — getProjectOutputs" |
| 2   | `getProjectOutputs` returns empty array when no publications linked                            | VERIFIED                                | `publications.ts:150` — `if (!joinRows?.length) return [];` short-circuit                                                                                        |
| 3   | Cache key includes projectId (no cross-project collision)                                      | VERIFIED                                | `publications.ts:163` — `["project-outputs", projectId]` as second arg to `unstable_cache`                                                                       |
| 4   | PublicationCard, PatentCard, ProjectCard render without horizontal overflow at 375px           | VERIFIED (code) / HUMAN NEEDED (visual) | All three cards have `min-w-0` + `break-words` on titles; metadata spans use `truncate min-w-0`; human approval recorded in 03-02-SUMMARY                        |
| 5   | Project detail page accessible to unauthenticated visitors for is_public=true projects         | VERIFIED                                | `projects/[slug]/page.tsx` — no `getSession()` or `AccessDenied` import; `notFound()` called on line 34 when project not found                                   |
| 6   | is_public=false project slug returns 404 to unauthenticated visitors                           | VERIFIED (code) / HUMAN NEEDED (RLS)    | `notFound()` at line 34 handles null return from `getProjectBySlug` which applies is_public filter via RLS                                                       |
| 7   | Project detail page shows linked publications and patents in ProjectOutputsSection             | VERIFIED                                | `projects/[slug]/page.tsx:7,9,36,259` — imports and calls `getProjectOutputs` then renders `<ProjectOutputsSection outputs={outputs} t={t} />`                   |
| 8   | Publication detail page shows linked project(s) via ProjectBacklink                            | VERIFIED                                | `publications/[slug]/page.tsx:8,242` — imports and renders `<ProjectBacklink .../>`                                                                              |
| 9   | Patent detail page shows linked project(s) via ProjectBacklink                                 | VERIFIED                                | `patents/[slug]/page.tsx:6,187` — imports and renders `<ProjectBacklink .../>`                                                                                   |
| 10  | ProjectOutputsSection uses min-w-0 w-full for MOB-02 compliance                                | VERIFIED                                | `ProjectOutputsSection.tsx:16` — `<div className="min-w-0 w-full">`; individual `<li>` elements also have `min-w-0`; title `<p>` uses `break-words`              |

**Score:** 10/10 truths verified (3 also need human confirmation for runtime behavior)

---

## Required Artifacts

| Artifact                                                      | Expected                                          | Status   | Details                                                                                                                                                 |
| ------------------------------------------------------------- | ------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/lib/queries/publications.ts`                    | `getProjectOutputs` exported async function       | VERIFIED | Export at line 141; two-step join with is_public filter and per-projectId cache key                                                                     |
| `frontend/src/lib/queries/publications.test.ts`               | Unit tests for getProjectOutputs                  | VERIFIED | 5 tests in `describe("LINK-01 — getProjectOutputs")` block covering mapped result, empty short-circuit, is_public filter, .in() call, error propagation |
| `frontend/src/components/projects/ProjectOutputsSection.tsx`  | Renders linked publications and patents           | VERIFIED | File exists; splits outputs into publications/patents sub-arrays; conditional rendering; min-w-0 compliance                                             |
| `frontend/src/components/shared/ProjectBacklink.tsx`          | Renders linked project link(s) on detail pages    | VERIFIED | File exists; accepts `projects` array; returns null if empty; renders project links                                                                     |
| `frontend/src/app/(public)/[locale]/projects/[slug]/page.tsx` | Public project detail page — no AccessDenied gate | VERIFIED | No `AccessDenied` import or usage found; `notFound()` present                                                                                           |
| `frontend/src/app/(public)/[locale]/projects/page.tsx`        | Public project list page — no AccessDenied gate   | VERIFIED | No matches for `getSession`, `AccessDenied`, or `is_public` in file                                                                                     |
| `frontend/src/components/publications/PublicationCard.tsx`    | Mobile-safe with min-w-0                          | VERIFIED | `min-w-0` on h3 (line 105), author span (line 119), venue span (line 161); `break-words` on h3                                                          |
| `frontend/src/components/patents/PatentCard.tsx`              | Mobile-safe with min-w-0                          | VERIFIED | `min-w-0` on h3 (line 50) and metadata spans; `break-words` on h3                                                                                       |
| `frontend/src/components/projects/ProjectCard.tsx`            | Mobile-safe with min-w-0                          | VERIFIED | `min-w-0` on h3 (line 42), organization span (line 77), tags div (line 130); `break-words` on h3                                                        |

---

## Key Link Verification

| From                           | To                                | Via                                                                                  | Status | Details       |
| ------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------ | ------ | ------------- |
| `publications.ts`              | `publication_projects` join table | `.from('publication_projects').select('publication_id').eq('project_id', projectId)` | WIRED  | Lines 145-148 |
| `getProjectOutputs`            | `is_public` filter                | `.eq('is_public', true)`                                                             | WIRED  | Line 156      |
| `projects/[slug]/page.tsx`     | `getProjectOutputs`               | `await getProjectOutputs(project.id)`                                                | WIRED  | Lines 9, 36   |
| `ProjectOutputsSection`        | rendered in project detail        | `<ProjectOutputsSection outputs={outputs} t={t} />`                                  | WIRED  | Line 259      |
| `publications/[slug]/page.tsx` | `ProjectBacklink`                 | `<ProjectBacklink .../>`                                                             | WIRED  | Lines 8, 242  |
| `patents/[slug]/page.tsx`      | `ProjectBacklink`                 | `<ProjectBacklink .../>`                                                             | WIRED  | Lines 6, 187  |

---

## Requirements Coverage

| Requirement | Source Plan | Description                                                                         | Status    | Evidence                                                                                                                                     |
| ----------- | ----------- | ----------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| LINK-01     | 03-01       | `getProjectOutputs(projectId)` query function — returns linked publications/patents | SATISFIED | Function implemented at `publications.ts:141-165`; 5 unit tests passing; REQUIREMENTS.md checkbox still `[ ]` — minor doc inconsistency only |
| LINK-02     | 03-03       | Project detail page shows `ProjectOutputsSection`                                   | SATISFIED | `ProjectOutputsSection` imported and rendered in `projects/[slug]/page.tsx`                                                                  |
| LINK-03     | 03-03       | Publication/patent detail pages show `ProjectBacklink`                              | SATISFIED | `ProjectBacklink` imported and rendered in both `publications/[slug]/page.tsx` and `patents/[slug]/page.tsx`                                 |
| MOB-01      | 03-02       | Card mobile layout overflow fixed                                                   | SATISFIED | `min-w-0` + `break-words` present in PublicationCard, PatentCard, ProjectCard; human approval recorded                                       |
| MOB-02      | 03-03       | ProjectOutputsSection mobile responsive                                             | SATISFIED | `min-w-0 w-full` on outer container; `min-w-0 break-words` on title `<p>` elements                                                           |

**Note on LINK-01:** The REQUIREMENTS.md checkbox remains `[ ]` (pending) while the status table at the bottom correctly shows `Pending` → implementation is actually complete. This is a doc-only inconsistency — the code fully satisfies LINK-01.

---

## Anti-Patterns Found

| File                           | Pattern       | Severity | Impact                                   |
| ------------------------------ | ------------- | -------- | ---------------------------------------- |
| `ProjectOutputsSection.tsx:10` | `return null` | Info     | Legitimate empty-state guard, not a stub |
| `ProjectBacklink.tsx:10`       | `return null` | Info     | Legitimate empty-state guard, not a stub |

No blockers or warnings found.

---

## Human Verification Required

### 1. Mobile overflow at 375px

**Test:** Open `/publications`, `/patents`, `/projects`, and a project detail page in Chrome DevTools at 375px width
**Expected:** No horizontal scrollbar; long Korean titles wrap within card bounds; ProjectOutputsSection output items stay within viewport
**Why human:** CSS rendering requires browser — cannot verify programmatically

### 2. Bidirectional navigation flow

**Test:** As a logged-out visitor, open a project detail page that has linked publications. Click a publication link. On the publication page, verify the "연계 과제" section appears with a link back to the project. Click it.
**Expected:** Full round-trip navigation works; no auth redirects
**Why human:** Navigation flow requires browser interaction

### 3. is_public=false project returns 404

**Test:** Identify a project with `is_public=false` in Supabase. Access `/projects/[its-slug]` as a logged-out user.
**Expected:** Next.js 404 page rendered (not AccessDenied, not the project content)
**Why human:** Depends on live Supabase RLS — cannot be verified from static analysis

---

## Summary

Phase 03 goal is fully achieved. All five requirement IDs (LINK-01, LINK-02, LINK-03, MOB-01, MOB-02) are implemented and wired:

- `getProjectOutputs` is a substantive, tested, cached two-step join query with correct is_public filtering and per-projectId cache keys.
- `ProjectOutputsSection` and `ProjectBacklink` are real server components wired into the correct detail pages with bidirectional cross-links.
- All three card components have mobile overflow guards (`min-w-0`, `break-words`, `truncate`) confirmed by human at 375px during plan execution.
- Project list and detail pages have no AccessDenied gate; unauthenticated visitors are served or shown 404 based on is_public status.

One minor doc inconsistency: LINK-01 checkbox in REQUIREMENTS.md is `[ ]` (pending) but the status table and actual code confirm it is complete. The REQUIREMENTS.md should be updated to `[x]` separately.

Three items flagged for human verification are runtime/visual checks; the static codebase fully supports them.

---

_Verified: 2026-03-15_
_Verifier: Claude (gsd-verifier)_
