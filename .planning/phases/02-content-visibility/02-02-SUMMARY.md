---
phase: 02-content-visibility
plan: "02"
subsystem: query-layer
tags: [vis-01, is_public, unstable_cache, publications, projects, patents]
dependency_graph:
  requires: [02-01]
  provides: [filtered-public-queries, open-publications-page, open-patents-page]
  affects: [home-sections, member-profiles, publications-page, patents-page]
tech_stack:
  added: [unstable_cache (next/cache)]
  patterns:
    [
      unstable_cache wrapper for public queries,
      is_public defense-in-depth filter,
    ]
key_files:
  created:
    - frontend/src/__mocks__/next/cache.ts
  modified:
    - frontend/src/lib/queries/publications.ts
    - frontend/src/lib/queries/projects.ts
    - frontend/src/app/(public)/[locale]/patents/page.tsx
    - frontend/vitest.config.ts
decisions:
  - unstable_cache wraps public query functions; getAllPublications/getPublicationById/getProjectById left unfiltered for professor portal
  - getPublicationsByMember and getProjectsByMember get is_public filter only (no cache — dynamic params)
  - next/cache mocked as pass-through in vitest via resolve.alias so unit tests execute inner query logic
metrics:
  duration: "3 minutes"
  completed_date: "2026-03-15"
  tasks_completed: 2
  files_modified: 4
  files_created: 1
---

# Phase 2 Plan 02: is_public Query Filters + Cache Summary

**One-liner:** Public publication/project queries wrapped in `unstable_cache` with `is_public=true` filter; `/patents` page auth gate removed.

## Tasks Completed

| #   | Name                                                                                                   | Commit  | Files                                                      |
| --- | ------------------------------------------------------------------------------------------------------ | ------- | ---------------------------------------------------------- |
| 1   | Add is_public filter + unstable_cache to public publication/patent queries                             | a47690e | publications.ts, **mocks**/next/cache.ts, vitest.config.ts |
| 2   | Add is_public filter + unstable_cache to public project queries; open /publications and /patents pages | 7168663 | projects.ts, patents/page.tsx                              |

## What Was Built

- `getPublications`, `getPatents`, `getPublicationBySlug`, `getPatentBySlug`, `getFeaturedPublications` — all wrapped in `unstable_cache` with `tags: ["publications"]` and `.eq("is_public", true)`
- `getAllPublications`, `getPublicationById` — unchanged (professor portal, no filter)
- `getPublicationsByMember` — `.eq("is_public", true)` added, no cache (dynamic param)
- `getProjects`, `getProjectBySlug`, `getFeaturedProjects`, `getActiveProjects`, `getDemoProjects` — all wrapped in `unstable_cache` with `tags: ["projects"]` and `.eq("is_public", true)`
- `getProjectById` — unchanged (professor portal)
- `getProjectsByMember` — `.eq("is_public", true)` added, no cache
- `/patents/page.tsx` — `getSession()` + `<AccessDenied />` gate removed; page renders for all visitors
- `/publications/page.tsx` — already had no auth gate; unchanged

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added next/cache mock for vitest**

- **Found during:** Task 1 verification
- **Issue:** `unstable_cache` from `next/cache` is a Next.js runtime API unavailable in vitest node environment. Wrapping query functions with it caused them to not execute in tests, so all `is_public` filter assertions failed (4/5 RED).
- **Fix:** Created `frontend/src/__mocks__/next/cache.ts` with `unstable_cache` as identity pass-through (`fn => fn`). Added `resolve.alias` in `vitest.config.ts` pointing `next/cache` to the mock file.
- **Files modified:** `frontend/src/__mocks__/next/cache.ts` (created), `frontend/vitest.config.ts`
- **Commit:** a47690e

## Verification Results

- publications.test.ts: 5/5 GREEN
- projects.test.ts: 4/4 GREEN
- Full test suite: 35/35 GREEN (4 test files)
- TypeScript: no errors (`pnpm tsc --noEmit` clean)

## Self-Check: PASSED
