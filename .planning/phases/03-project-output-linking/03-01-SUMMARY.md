---
phase: 03-project-output-linking
plan: 01
subsystem: database
tags: [supabase, vitest, tdd, publications, projects, cache]

requires:
  - phase: 02-content-visibility
    provides: is_public filter pattern on publications queries

provides:
  - getProjectOutputs(projectId) exported from publications.ts
  - Unit tests for getProjectOutputs (5 test cases passing)

affects:
  - phase 04 (project detail page will consume getProjectOutputs)

tech-stack:
  added: []
  patterns:
    - "Two-step join: publication_projects → publications via .in('id', pubIds)"
    - "Per-projectId cache key to prevent cross-project cache collision"
    - "Short-circuit empty return when join table has no rows"

key-files:
  created:
    - frontend/src/lib/queries/publications.test.ts (getProjectOutputs describe block added)
  modified:
    - frontend/src/lib/queries/publications.ts

key-decisions:
  - "Cache key is ['project-outputs', projectId] not ['project-outputs'] alone — cross-project collision prevention"
  - "Cache tags include both 'projects' and 'publications' so either write action invalidates it"
  - "Early return [] when publication_projects returns no rows — avoids unnecessary publications query"

patterns-established:
  - "Two-step join pattern: fetch join-table IDs first, then .in('id', ids) on target table"
  - "Per-entity cache key in unstable_cache for parameterized queries"

requirements-completed: [LINK-01]

duration: 15min
completed: 2026-03-15
---

# Phase 03 Plan 01: getProjectOutputs Query Function Summary

**Cached two-step join query `getProjectOutputs(projectId)` linking publication_projects to publications with is_public filter, per-projectId cache key, and 5 passing vitest unit tests**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-15
- **Completed:** 2026-03-15
- **Tasks:** 2 (RED + GREEN)
- **Files modified:** 2

## Accomplishments

- Exported `getProjectOutputs(projectId)` function in `publications.ts`
- Two-step join: queries `publication_projects` for IDs, then fetches `publications` filtered by `is_public=true` and `.in('id', pubIds)`
- Cache key `["project-outputs", projectId]` prevents cross-project stale data
- 5 unit tests all passing: mapped result, empty short-circuit, is_public filter, .in() call, error propagation

## Task Commits

1. **RED — failing tests for getProjectOutputs** - `057ae2a` (test)
2. **GREEN — implement getProjectOutputs** - `9c8c52f` (feat)

## Files Created/Modified

- `frontend/src/lib/queries/publications.ts` - Added `getProjectOutputs` export (lines 140-164)
- `frontend/src/lib/queries/publications.test.ts` - Added `describe("LINK-01 — getProjectOutputs")` block with 5 tests

## Decisions Made

- Cache key includes `projectId` as second element to prevent cross-project cache collision (plan specified this as a named pitfall)
- Cache tags `["projects", "publications"]` — both write actions can invalidate project output listings
- Short-circuit `return []` before querying publications when join returns no rows

## Deviations from Plan

None - plan executed exactly as written. Implementation was already present in publications.ts from a prior session; GREEN commit staged only that file.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `getProjectOutputs` is ready to be consumed by project detail pages in phase 04
- Function is exported, cached, and tested

---

_Phase: 03-project-output-linking_
_Completed: 2026-03-15_
