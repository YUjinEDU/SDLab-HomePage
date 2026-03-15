---
phase: 04-professor-portal-ux
plan: 01
subsystem: visibility-actions
tags: [tdd, server-actions, visibility, types]
dependency_graph:
  requires: []
  provides:
    [
      togglePublicationVisibility,
      toggleProjectVisibility,
      getAllProjects,
      isPublic-types,
    ]
  affects: [04-02-professor-portal-ui]
tech_stack:
  added: []
  patterns: [TDD vitest, assertRole guard, revalidateTag cache invalidation]
key_files:
  created:
    - frontend/src/actions/visibility.ts
    - frontend/src/actions/visibility.test.ts
  modified:
    - frontend/src/types/publication.ts (already had isPublic — verified)
    - frontend/src/lib/queries/projects.ts (already had isPublic + getAllProjects — verified)
decisions:
  - "publications default is_public=true, projects default is_public=false confirmed in toPublication/toProject mappers"
  - "assertRole returns null|{error:'unauthorized'} — inline conditional guard in Server Actions"
  - "@ts-expect-error on revalidateTag — established project pattern for Next.js 16 type mismatch"
metrics:
  duration: 15min
  completed: 2026-03-15
  tasks_completed: 2
  files_created: 2
  files_modified: 0
requirements: [VIS-03]
---

# Phase 4 Plan 1: Visibility Server Actions (TDD) Summary

**One-liner:** TDD visibility Server Actions with assertRole guard, DB update, and revalidateTag for publications and projects toggle.

## What Was Built

VIS-03 implementation: two Server Actions that allow professor/admin users to toggle `is_public` on publications and projects records, with cache invalidation via `revalidateTag`.

Both Publication and Project types already exposed `isPublic: boolean` and `getAllProjects()` (uncached) was already present from prior work — verified and committed as Task 1.

## Tasks

### Task 1: Extend types and add getAllProjects

**Status:** Complete (pre-existing, verified)
**Commit:** c788245

- `Publication.isPublic: boolean` — present in `types/publication.ts`
- `Project.isPublic: boolean` — mapped via `toProject()` with default `false`
- `toPublication()` maps `is_public` with default `true` (publications default per STATE.md)
- `getAllProjects()` uncached function exported from `queries/projects.ts`
- TypeScript compile check: TS errors confined to pre-existing `publications.test.ts` (out of scope)

### Task 2: TDD — visibility.test.ts (RED) then visibility.ts (GREEN)

**Status:** Complete
**Commit:** 5ff7925

RED: `visibility.test.ts` written with 9 tests, confirmed failing (module not found).
GREEN: `visibility.ts` written — all 9 tests pass.

**Test coverage:**

- `togglePublicationVisibility(id, true/false)` — correct table, update payload, eq filter
- `revalidateTag("publications")` called on success
- Unauthorized caller: returns `{error}` without touching DB
- DB error: returns `{error: message}`, no revalidateTag
- Same 4 behaviors for `toggleProjectVisibility` + projects table/tag

## Deviations from Plan

### Pre-existing work (not deviations — verified correct)

Task 1 artifacts were already implemented correctly from earlier phases:

- `isPublic` in both type definitions
- `toProject()`/`toPublication()` mappers with correct defaults
- `getAllProjects()` uncached function

No fixes required. Plan executed with confirmation commit.

### Out of Scope (Deferred)

**Pre-existing TS errors in `publications.test.ts`** — destructuring type mismatch in `.mock.calls.some()` callbacks. These existed before this plan and are not caused by current changes. Noted as out-of-scope per task instructions.

## Self-Check

- [x] `frontend/src/actions/visibility.ts` exists
- [x] `frontend/src/actions/visibility.test.ts` exists — 9 tests pass
- [x] `Publication.isPublic` and `Project.isPublic` confirmed present
- [x] `getAllProjects` exported from `queries/projects.ts`
- [x] Task 1 commit: c788245
- [x] Task 2 commit: 5ff7925

## Self-Check: PASSED
