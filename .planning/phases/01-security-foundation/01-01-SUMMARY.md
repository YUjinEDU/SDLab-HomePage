---
phase: 01-security-foundation
plan: 01
subsystem: auth
tags: [permissions, role-guard, vitest, typescript, supabase]

requires: []
provides:
  - "assertRole(minRole): async role check returning null or { error: 'unauthorized' }"
  - "requireRole(minRole): throws Error('unauthorized') for insufficient roles"
  - "ROLE_HIERARCHY: member=0, professor=1, admin=2"
  - "vitest test runner configured for frontend/"
affects:
  - 01-02
  - 01-03
  - 01-04
  - all Server Actions in (professor) and (internal) routes

tech-stack:
  added: [vitest, vite-tsconfig-paths]
  patterns:
    - "Role guard pattern: assertRole() returns null|error, requireRole() throws — callers handle redirect/render"
    - "TDD: RED commit (failing tests) then GREEN commit (passing implementation)"

key-files:
  created:
    - frontend/src/lib/permissions/index.ts
    - frontend/src/lib/permissions/__tests__/permissions.test.ts
    - frontend/vitest.config.ts
  modified:
    - frontend/package.json
    - frontend/pnpm-lock.yaml

key-decisions:
  - "assertRole returns null (not void) on success to enable inline conditional checks in Server Actions"
  - "requireRole throws Error('unauthorized') — callers use try/catch to redirect('/login') or render AccessDenied"
  - "Role type as string literal union (not enum) per CLAUDE.md convention"
  - "ROLE_HIERARCHY numeric map enables simple rank comparison: admin >= professor >= member"

patterns-established:
  - "Role guard entry point: all Server Actions call requireRole() as first line"
  - "assertRole for conditional logic; requireRole for strict gates"

requirements-completed: [SEC-01]

duration: 10min
completed: 2026-03-15
---

# Phase 01 Plan 01: Permissions Role Guard Summary

**Async role guard module with assertRole/requireRole using numeric ROLE_HIERARCHY, backed by 7 passing vitest unit tests**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-14T23:53:32Z
- **Completed:** 2026-03-15T00:04:00Z
- **Tasks:** 3 (vitest config, RED tests, GREEN implementation)
- **Files modified:** 5

## Accomplishments

- Vitest + vite-tsconfig-paths installed and configured for the frontend workspace
- 7 unit tests written covering all role combinations including hierarchy (admin >= professor)
- assertRole/requireRole implemented with ROLE_HIERARCHY map; TypeScript compiles clean

## Task Commits

1. **RED: vitest config + failing tests** - `0ec04cc` (test)
2. **GREEN: permissions implementation** - `b65253a` (feat)

## Files Created/Modified

- `frontend/src/lib/permissions/index.ts` - Role type, ROLE_HIERARCHY, assertRole, requireRole
- `frontend/src/lib/permissions/__tests__/permissions.test.ts` - 7 unit tests for role guard logic
- `frontend/vitest.config.ts` - Vitest config with node environment and tsconfig paths
- `frontend/package.json` - Added vitest, vite-tsconfig-paths as devDependencies
- `frontend/pnpm-lock.yaml` - Lockfile updated

## Decisions Made

- assertRole returns `null | { error: 'unauthorized' }` (not boolean) — allows callers to distinguish and forward the error object if needed
- requireRole throws rather than returns — Server Actions can use try/catch or let the error propagate to error boundaries
- Role string literal union instead of enum per project CLAUDE.md convention

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- assertRole and requireRole are ready to be imported in Server Actions (plans 01-02, 01-03, 01-04)
- The `profiles.role` column is already confirmed in 001_initial_schema.sql migration
- No blockers

---

_Phase: 01-security-foundation_
_Completed: 2026-03-15_
