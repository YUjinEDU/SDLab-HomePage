---
phase: 02-content-visibility
plan: "01"
subsystem: test-scaffold
tags: [tdd, vitest, is_public, revalidateTag, VIS-01, VIS-02]
dependency_graph:
  requires: []
  provides: [VIS-01-tests, VIS-02-tests]
  affects: [02-02-PLAN, 02-03-PLAN]
tech_stack:
  added: []
  patterns:
    [
      vi.hoisted for mock hoisting,
      chainable Supabase mock,
      next/cache revalidateTag mock,
    ]
key_files:
  created:
    - frontend/src/lib/queries/publications.test.ts
    - frontend/src/lib/queries/projects.test.ts
  modified:
    - frontend/src/actions/__tests__/professor-actions.test.ts
decisions:
  - "vi.hoisted() used instead of top-level const for mockChain — vi.mock factory is hoisted above variable declarations"
  - "order() mock returns a thenable (Object.assign of Promise + chain) to handle both chained and terminal usage patterns"
  - "getAllPublications and getProjectById negative-assertion tests pass in RED state (correct by design — these are internal queries)"
metrics:
  duration: "3 minutes"
  completed_date: "2026-03-15"
  tasks_completed: 1
  files_created: 2
  files_modified: 1
---

# Phase 02 Plan 01: VIS-01 and VIS-02 Test Scaffold Summary

**One-liner:** Failing unit tests that assert `is_public` filter on public query functions and `revalidateTag` calls on professor mutations — drives Plans 02 and 03.

## What Was Built

Three test files establishing the RED state for Phase 2:

**`publications.test.ts`** — 5 tests, all fail:

- `getPublications()` must call `.eq('is_public', true)`
- `getPatents()` must call `.eq('is_public', true)`
- `getPublicationBySlug()` must call `.eq('is_public', true)`
- `getFeaturedPublications()` must call `.eq('is_public', true)`
- `getAllPublications()` must NOT call `.eq('is_public', true)` — passes (correct)

**`projects.test.ts`** — 4 tests, 3 fail:

- `getProjects()` must call `.eq('is_public', true)`
- `getFeaturedProjects()` must call `.eq('is_public', true)`
- `getProjectBySlug()` must call `.eq('is_public', true)`
- `getProjectById()` must NOT call `.eq('is_public', true)` — passes (correct)

**`professor-actions.test.ts`** (extended) — 6 new tests, all fail:

- `createPublication/updatePublication/deletePublication` must call `revalidateTag('publications')`
- `createProject/updateProject/deleteProject` must call `revalidateTag('projects')`

Existing 11 tests (permissions + role guard) remain green.

## Test Run Result

```
Tests: 13 failed | 11 passed | 24 total
Files: 2 failed (new) | 2 passed (existing)
```

Expected: new tests RED, existing tests GREEN. Confirmed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed vi.mock hoisting issue in query test files**

- **Found during:** Task 1 — first test run
- **Issue:** `vi.mock` factory is hoisted above `const mockChain` declaration, causing `ReferenceError: Cannot access 'mockChain' before initialization`
- **Fix:** Replaced top-level `const mockChain = { ... }` with `const mockChain = vi.hoisted(() => { ... })` so the variable is available when the hoisted mock factory executes
- **Files modified:** `publications.test.ts`, `projects.test.ts`
- **Commit:** 78303f2

## Self-Check: PASSED

- FOUND: frontend/src/lib/queries/publications.test.ts
- FOUND: frontend/src/lib/queries/projects.test.ts
- FOUND: frontend/src/actions/**tests**/professor-actions.test.ts
- FOUND: commit 78303f2
