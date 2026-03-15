---
phase: 01-security-foundation
plan: 03
subsystem: server-actions
tags: [security, role-guard, server-actions, professor-layout, tdd]
dependency_graph:
  requires: [01-01]
  provides: [professor-action-guards, professor-layout-gate]
  affects: [publications, projects, members, news, contact, professor-layout]
tech_stack:
  added: []
  patterns: [assertRole-guard-pattern, requireRole-layout-pattern]
key_files:
  created:
    - frontend/src/actions/__tests__/professor-actions.test.ts
  modified:
    - frontend/src/actions/publications.ts
    - frontend/src/actions/projects.ts
    - frontend/src/actions/members.ts
    - frontend/src/actions/news.ts
    - frontend/src/actions/contact.ts
    - frontend/src/app/(professor)/layout.tsx
decisions:
  - "contact.ts updateContact guarded with assertRole('professor') — it writes lab contact info, professor-only operation"
  - "TDD RED→GREEN: tests written first against unguarded actions, then guards applied to turn green"
metrics:
  duration: "~10 minutes"
  completed: "2026-03-15T00:01:49Z"
  tasks_completed: 2
  files_modified: 7
---

# Phase 1 Plan 3: Professor Server Action Role Guards Summary

**One-liner:** assertRole('professor') guard on all 14 write Server Actions + requireRole layout gate redirecting member-role users to /login.

## What Was Built

Added `assertRole('professor')` as the first guard in every write Server Action under the professor portal, and added `requireRole('professor')` to the `(professor)` layout. Before this plan, any authenticated user (even `member` role) could invoke write actions directly — there was zero role enforcement on the API surface.

### Actions patched (14 functions across 5 files)

| File                      | Functions guarded                                       |
| ------------------------- | ------------------------------------------------------- |
| `actions/publications.ts` | createPublication, updatePublication, deletePublication |
| `actions/projects.ts`     | createProject, updateProject, deleteProject             |
| `actions/members.ts`      | createMember, updateMember, deleteMember                |
| `actions/news.ts`         | createNews, updateNews, deleteNews                      |
| `actions/contact.ts`      | updateContact                                           |

### Layout gated

`app/(professor)/layout.tsx` now calls `requireRole('professor')` after the null-user check. If the user is authenticated but lacks professor/admin role, they are redirected to `/login`.

## Guard Pattern Applied

```typescript
// Every write action — first two lines of function body
const authError = await assertRole("professor");
if (authError) return authError;
```

```typescript
// Professor layout — after existing user check
try {
  await requireRole("professor");
} catch {
  redirect("/login");
}
```

## Test Results

- **13 unit tests** covering all guarded functions — all GREEN
- `pnpm tsc --noEmit` exits 0 (no TypeScript errors)

## Commits

| Task           | Commit  | Description                                                             |
| -------------- | ------- | ----------------------------------------------------------------------- |
| Task 1 (RED)   | ef28ae3 | test(01-03): add failing tests for professor action role guards         |
| Task 2 (GREEN) | 6db53cf | feat(01-03): add assertRole guard to all professor write Server Actions |

## Deviations from Plan

None — plan executed exactly as written.

The only minor note: `contact.ts` was confirmed to have a write action (`updateContact` for lab contact info) and was guarded as specified. The plan said "review if it has write actions — if yes, apply same pattern" — it did, so the guard was applied.

## Self-Check: PASSED

- [x] `frontend/src/actions/__tests__/professor-actions.test.ts` — exists, 13 tests pass
- [x] `frontend/src/actions/publications.ts` — 3 functions guarded
- [x] `frontend/src/actions/projects.ts` — 3 functions guarded
- [x] `frontend/src/actions/members.ts` — 3 functions guarded
- [x] `frontend/src/actions/news.ts` — 3 functions guarded
- [x] `frontend/src/actions/contact.ts` — 1 function guarded
- [x] `frontend/src/app/(professor)/layout.tsx` — requireRole gate added
- [x] Commit ef28ae3 exists (RED tests)
- [x] Commit 6db53cf exists (GREEN guards)
