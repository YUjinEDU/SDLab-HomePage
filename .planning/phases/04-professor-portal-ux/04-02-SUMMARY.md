---
phase: 04-professor-portal-ux
plan: "02"
subsystem: ui
tags: [react, nextjs, server-actions, optimistic-ui, visibility]

requires:
  - phase: 04-01
    provides: togglePublicationVisibility, toggleProjectVisibility Server Actions; isPublic field on Publication and Project types; getAllPublications, getAllProjects uncached queries

provides:
  - VisibilityToggleButton client component with optimistic state and useTransition pending UX
  - Professor publications page shows ALL items (including private) with inline toggle
  - Professor patents page shows ALL patents (including private) with inline toggle
  - Professor projects page shows ALL items (including private) with inline toggle

affects:
  - 04-03
  - public portal visibility (publications, patents, projects)

tech-stack:
  added: []
  patterns:
    - Server Action passed as prop to client component (toggle prop pattern)
    - Optimistic useState + useTransition for immediate UI feedback without router.refresh()
    - getAllPublications filtered client-side by type for patents professor page

key-files:
  created:
    - frontend/src/components/professor/VisibilityToggleButton.tsx
  modified:
    - frontend/src/app/(professor)/professor/publications/page.tsx
    - frontend/src/app/(professor)/professor/patents/page.tsx
    - frontend/src/app/(professor)/professor/projects/page.tsx
    - frontend/src/lib/queries/index.ts

key-decisions:
  - "Patents professor page uses getAllPublications filtered by type='patent' (no getAllPatents needed — client-side filter sufficient)"
  - "getAllProjects added to lib/queries/index.ts export (was missing from 04-01)"
  - "No router.refresh() in VisibilityToggleButton — revalidateTag in Server Action handles cache invalidation"

patterns-established:
  - "ToggleFn type: (id, isPublic) => Promise<{error?} | {success}> — reusable signature for both publications and projects"
  - "Optimistic toggle: setIsPublic(next) before await, revert to !next on error"

requirements-completed:
  - VIS-03

duration: 20min
completed: 2026-03-15
---

# Phase 4 Plan 02: Visibility Toggle UX Summary

**VisibilityToggleButton client component wired into professor publications, patents, and projects pages with optimistic state update and Server Action passed as prop**

## Performance

- **Duration:** 20 min
- **Started:** 2026-03-15T20:00:00Z
- **Completed:** 2026-03-15T20:20:00Z
- **Tasks:** 2 (+ checkpoint awaiting human verify)
- **Files modified:** 5

## Accomplishments

- Created `VisibilityToggleButton` with optimistic useState, useTransition pending state, and error revert
- Updated all three professor list pages to use uncached queries (getAllPublications, getAllProjects) — shows private items
- Each row renders clickable "공개"/"비공개" badge toggle before edit/delete actions

## Task Commits

1. **Task 1: Create VisibilityToggleButton component** - `643032d` (feat)
2. **Task 2: Wire toggle into professor publications, patents, and projects pages** - `c1868a8` (feat)

## Files Created/Modified

- `frontend/src/components/professor/VisibilityToggleButton.tsx` - "use client" toggle badge component
- `frontend/src/app/(professor)/professor/publications/page.tsx` - getAllPublications + VisibilityToggleButton per row
- `frontend/src/app/(professor)/professor/patents/page.tsx` - getAllPublications filtered by type='patent' + toggle
- `frontend/src/app/(professor)/professor/projects/page.tsx` - getAllProjects + VisibilityToggleButton per row
- `frontend/src/lib/queries/index.ts` - added getAllProjects export (was missing)

## Decisions Made

- Patents professor page uses `getAllPublications` filtered client-side by `type === 'patent'` rather than creating a new `getAllPatents` function — minimal approach, avoids duplication
- `getAllProjects` was not exported from `lib/queries/index.ts` despite being defined in 04-01 — added export as Rule 3 auto-fix (blocking import)
- No `router.refresh()` in toggle button — Server Action's `revalidateTag` handles cache invalidation on next page load

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added getAllProjects to lib/queries/index.ts export**

- **Found during:** Task 2 (projects page update)
- **Issue:** `getAllProjects` was defined in `projects.ts` by 04-01 but not exported from the barrel `index.ts`, making it unavailable via `@/lib/queries` import path
- **Fix:** Added `getAllProjects` to the export list in `lib/queries/index.ts`
- **Files modified:** `frontend/src/lib/queries/index.ts`
- **Verification:** TypeScript check passes with no new errors
- **Committed in:** `c1868a8` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 3 - blocking missing export)
**Impact on plan:** Required for correctness. No scope creep.

## Issues Encountered

- Pre-existing TypeScript errors in `publications.test.ts` (tuple destructuring type mismatch from 04-01 mock patterns) — out of scope, not touched.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- VIS-03 complete: professors can toggle visibility from portal without DB access
- Human verification of toggle UX end-to-end still pending (checkpoint:human-verify)
- Ready for 04-03 once checkpoint approved

---

_Phase: 04-professor-portal-ux_
_Completed: 2026-03-15_
