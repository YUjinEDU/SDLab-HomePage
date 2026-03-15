---
phase: "4"
phase-slug: professor-portal-ux
date: 2026-03-15
---

# Phase 4: Professor Portal UX — Validation Strategy

## Test Framework

| Property           | Value                                                           |
| ------------------ | --------------------------------------------------------------- |
| Framework          | vitest (node environment)                                       |
| Config file        | `frontend/vitest.config.ts`                                     |
| Quick run command  | `cd frontend && pnpm vitest run src/actions/visibility.test.ts` |
| Full suite command | `cd frontend && pnpm vitest run`                                |

## Phase Requirements → Test Map

| Req ID | Behavior                                                                                    | Test Type | Automated Command                                               | File Exists? |
| ------ | ------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------- | ------------ |
| VIS-03 | `togglePublicationVisibility` updates `is_public` and calls `revalidateTag("publications")` | unit      | `cd frontend && pnpm vitest run src/actions/visibility.test.ts` | Wave 0       |
| VIS-03 | `toggleProjectVisibility` updates `is_public` and calls `revalidateTag("projects")`         | unit      | `cd frontend && pnpm vitest run src/actions/visibility.test.ts` | Wave 0       |
| VIS-03 | assertRole check blocks unauthorized callers                                                | unit      | same file                                                       | Wave 0       |

## Sampling Rate

- **Per task commit:** `cd frontend && pnpm vitest run src/actions/visibility.test.ts`
- **Per wave merge:** `cd frontend && pnpm vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

## Wave 0 Gaps

- [ ] `frontend/src/actions/visibility.test.ts` — covers VIS-03 Server Action behavior
- [ ] `frontend/src/actions/__tests__/` directory (or co-locate with source)

_(Existing vitest infrastructure in `src/lib/queries/` pattern can be followed — mock `@/lib/db/supabase-server` and `next/cache`.)_
