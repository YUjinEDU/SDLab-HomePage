# Testing Patterns

**Analysis Date:** 2026-03-14

## Test Framework

**Runner:** Not configured — no test framework installed.

**Status:** Zero test files exist in the codebase. No `jest.config.*`, `vitest.config.*`, or `*.test.*` / `*.spec.*` files were found anywhere under `frontend/src/`.

**package.json scripts:**

```bash
pnpm dev      # Development server
pnpm build    # Production build
pnpm start    # Production server
pnpm lint     # ESLint only
```

No `test` script is present in `frontend/package.json`.

## Test File Organization

**Location:** Not applicable — no tests exist.

**Naming:** No pattern established.

## Test Structure

No test structure exists. There are no example test suites, `describe` blocks, `it`/`test` calls, or assertion patterns in this codebase.

## Mocking

No mocking framework or patterns are established.

## Fixtures and Factories

No test fixtures or factory functions exist.

## Coverage

**Requirements:** None enforced — no coverage tooling configured.

## Test Types

**Unit Tests:** Not used.

**Integration Tests:** Not used.

**E2E Tests:** Not used.

## What Should Be Tested (Recommended Additions)

Given the codebase structure, priority areas for future test coverage:

**Unit tests — utility functions:**

- `frontend/src/lib/utils/slug.ts` — `generateSlug` is pure and easily testable
- `frontend/src/lib/queries/*.ts` — DB mappers (e.g., `toPublication`) are pure transformation functions

**Integration tests — Server Actions:**

- `frontend/src/actions/publications.ts` — CRUD operations against Supabase
- `frontend/src/actions/members.ts` — member management
- `frontend/src/actions/auth.ts` — login/session flows

**Component tests:**

- `frontend/src/components/publications/PublicationFilters.tsx` — filter state logic
- `frontend/src/components/shared/Pagination.tsx` — pagination boundary conditions

**Recommended stack (if adding tests):**

- Unit/integration: Vitest (compatible with Next.js App Router, fast, ESM-native)
- Component: React Testing Library + Vitest
- E2E: Playwright
- Supabase mocking: `@supabase/supabase-js` mock or local Supabase instance via Docker

**Recommended config location:**

- `frontend/vitest.config.ts`
- Test files co-located: `*.test.ts` / `*.test.tsx` next to source files

---

_Testing analysis: 2026-03-14_
