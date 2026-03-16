---
phase: 01-security-foundation
verified: 2026-03-15T00:00:00Z
status: human_needed
score: 11/11 must-haves verified
re_verification: false
human_verification:
  - test: "Apply migration 004 to live Supabase and verify RLS enforcement"
    expected: "curl with anon key to /rest/v1/publications?is_public=eq.false returns 0 rows; curl to /rest/v1/projects?is_public=eq.false returns 0 rows; professor-role query returns all rows including private ones"
    why_human: "Migration 004 is a SQL file — DB-level RLS enforcement cannot be verified without applying to a running Supabase instance"
  - test: "Verify update_publication_with_relations RPC is callable"
    expected: "rpc('update_publication_with_relations', {...}) from professor-role session completes without error and all three join tables are updated atomically"
    why_human: "RPC function execution requires live DB connection"
  - test: "Confirm CVE-2025-29927 bypass is blocked end-to-end"
    expected: "curl -H 'x-middleware-subrequest: pages/internal/page' http://localhost:3000/internal returns HTTP 307 redirect to /login — NOT 200"
    why_human: "Middleware behavior requires running Next.js dev server; already human-approved per 01-04-SUMMARY but worth noting for final sign-off"
---

# Phase 01: Security Foundation Verification Report

**Phase Goal:** Establish the security foundation — server-side role enforcement, DB-level access control, and middleware CVE patch.
**Verified:** 2026-03-15
**Status:** human_needed — all automated checks passed; DB migration requires live Supabase apply to confirm RLS enforcement
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                             | Status              | Evidence                                                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `assertRole('professor')` called with member-role user returns `{ error: 'unauthorized' }`        | VERIFIED            | `permissions/index.ts` lines 41-43: userRank < minRank returns error; test line 39-43 covers this case                                                     |
| 2   | `assertRole('professor')` called with professor-role user returns `null`                          | VERIFIED            | `permissions/index.ts` line 45: returns null on success; test line 45-51 covers this                                                                       |
| 3   | `assertRole('admin')` called with professor-role user returns `{ error: 'unauthorized' }`         | VERIFIED            | ROLE_HIERARCHY: professor=1, admin=2; rank check enforces this; test line 59-65 covers it                                                                  |
| 4   | `requireRole` throws when `assertRole` returns an error                                           | VERIFIED            | `permissions/index.ts` lines 54-57: throws Error('unauthorized') when result !== null                                                                      |
| 5   | Both functions are exported from `lib/permissions/index.ts`                                       | VERIFIED            | File exports `assertRole` (line 15) and `requireRole` (line 53)                                                                                            |
| 6   | A member-role user calling any professor/admin Server Action receives `{ error: 'unauthorized' }` | VERIFIED            | All 14 write actions in publications.ts, projects.ts, members.ts, news.ts, contact.ts confirmed to have `assertRole('professor')` guard as first two lines |
| 7   | The (professor) layout redirects to /login for non-professor/admin users                          | VERIFIED            | `(professor)/layout.tsx` lines 14-18: try/catch requireRole('professor') → redirect('/login')                                                              |
| 8   | publications and projects tables have `is_public BOOLEAN NOT NULL` column                         | VERIFIED            | `004_add_is_public.sql` lines 13-16: ALTER TABLE IF NOT EXISTS with NOT NULL DEFAULT                                                                       |
| 9   | publications default `is_public = true`, projects default `is_public = false`                     | VERIFIED            | `004_add_is_public.sql` lines 13, 16 confirm defaults; backfill on lines 22-23                                                                             |
| 10  | Anon role cannot SELECT rows where `is_public = false`                                            | VERIFIED (SQL only) | `004_add_is_public.sql` lines 34-38: USING (is_public = true OR is_admin_or_professor()); requires live DB to confirm behavior                             |
| 11  | `x-middleware-subrequest` header is blocked in middleware                                         | VERIFIED            | `middleware.ts` lines 13-18: explicit header check at top of function, redirects to /login                                                                 |

**Score:** 11/11 truths verified (1 requires live DB confirmation)

---

## Required Artifacts

| Artifact                                                     | Expected                                 | Status   | Details                                                                                   |
| ------------------------------------------------------------ | ---------------------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| `frontend/src/lib/permissions/index.ts`                      | assertRole() and requireRole() exports   | VERIFIED | 59 lines, fully implemented with ROLE_HIERARCHY, createClient() call, profiles.role query |
| `frontend/src/lib/permissions/__tests__/permissions.test.ts` | 7 unit tests for role hierarchy          | VERIFIED | 87 lines, 7 tests covering all role combinations including admin >= professor hierarchy   |
| `frontend/vitest.config.ts`                                  | Vitest test runner config                | VERIFIED | 7 lines, node environment, tsconfigPaths plugin                                           |
| `frontend/supabase/migrations/004_add_is_public.sql`         | ALTER TABLE, RLS policies, RPC function  | VERIFIED | 105 lines, all 4 sections present and complete                                            |
| `frontend/src/actions/publications.ts`                       | assertRole guard on create/update/delete | VERIFIED | assertRole found at lines 9, 102, 203                                                     |
| `frontend/src/actions/projects.ts`                           | assertRole guard on create/update/delete | VERIFIED | assertRole found at lines 9, 85, 161                                                      |
| `frontend/src/actions/members.ts`                            | assertRole guard on create/update/delete | VERIFIED | assertRole found at lines 45, 106, 165                                                    |
| `frontend/src/actions/news.ts`                               | assertRole guard on create/update/delete | VERIFIED | assertRole found at lines 9, 62, 115                                                      |
| `frontend/src/actions/contact.ts`                            | assertRole guard on updateContact        | VERIFIED | assertRole found at line 8                                                                |
| `frontend/src/app/(professor)/layout.tsx`                    | requireRole gate, redirect to /login     | VERIFIED | requireRole('professor') at line 15, redirect('/login') in catch at line 17               |
| `frontend/src/actions/__tests__/professor-actions.test.ts`   | 13 tests for unauthorized returns        | VERIFIED | 13 test cases confirmed in file, covering all 14 guarded functions                        |
| `frontend/src/middleware.ts`                                 | CVE-2025-29927 header block              | VERIFIED | x-middleware-subrequest check at lines 16-18, before any routing logic                    |

---

## Key Link Verification

| From                                    | To                                                                                | Via                                          | Status | Details                                                           |
| --------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------- | ------ | ----------------------------------------------------------------- |
| `permissions/index.ts`                  | `lib/db/supabase-server.ts`                                                       | `createClient()` import                      | WIRED  | Line 1: `import { createClient } from "@/lib/db/supabase-server"` |
| `permissions/index.ts`                  | profiles table                                                                    | `supabase.from('profiles').select('role')`   | WIRED  | Lines 28-33: query confirmed                                      |
| `actions/publications.ts`               | `lib/permissions/index.ts`                                                        | `assertRole('professor')` first line         | WIRED  | Import at line 6, guard at line 9                                 |
| `(professor)/layout.tsx`                | `lib/permissions/index.ts`                                                        | `requireRole('professor')` in try/catch      | WIRED  | Import at line 4, call at line 15                                 |
| `004_add_is_public.sql` RLS policy      | `is_admin_or_professor()` function                                                | USING clause reuse                           | WIRED  | Lines 35, 38: both policies use `is_admin_or_professor()`         |
| `update_publication_with_relations` RPC | publication_authors, publication_research_areas, publication_projects join tables | DELETE + INSERT in transaction               | WIRED  | Lines 90-103: all three join tables have DELETE + INSERT blocks   |
| `middleware.ts`                         | internal/professor routes                                                         | x-middleware-subrequest check before routing | WIRED  | Lines 16-18 check fires before route branching at line 23         |

---

## Requirements Coverage

| Requirement | Source Plan | Description                                                      | Status               | Evidence                                                                                                                                  |
| ----------- | ----------- | ---------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-01      | 01-01-PLAN  | `assertRole()` and `requireRole()` exported from lib/permissions | SATISFIED            | Both exports verified in `permissions/index.ts`; 7 tests pass                                                                             |
| SEC-02      | 01-03-PLAN  | assertRole guard on all professor/admin Server Actions           | SATISFIED            | 14 write actions guarded across 5 files; 13 tests verified; note: patents are publications (type='patent'), no separate patents.ts needed |
| SEC-03      | 01-04-PLAN  | CVE-2025-29927 middleware patch applied                          | SATISFIED            | `middleware.ts` has x-middleware-subrequest block; human-approved per 01-04-SUMMARY (HTTP 307 confirmed)                                  |
| DB-01       | 01-02-PLAN  | is_public BOOLEAN NOT NULL on publications and projects          | SATISFIED (SQL only) | `004_add_is_public.sql` has correct ALTER TABLE statements; requires migration apply to live DB                                           |
| DB-02       | 01-02-PLAN  | RLS policy limiting anon to is_public=true rows                  | SATISFIED (SQL only) | USING clause confirmed in migration; live DB apply required for behavioral verification                                                   |
| DB-03       | 01-02-PLAN  | updatePublication join table updates via RPC for atomicity       | SATISFIED (SQL only) | `update_publication_with_relations` function present with all 3 join table DELETE+INSERT blocks                                           |

**Notes on SEC-02 / patents:** REQUIREMENTS.md SEC-02 lists "patents" as a covered domain. No `actions/patents.ts` file exists because patents are stored as `publications` rows with `type = 'patent'`. The `publications.ts` actions guard covers patent write operations. This is architecturally correct and consistent with Migration 004's design.

---

## Anti-Patterns Found

No blockers or stubs detected in the verified files.

| File            | Line | Pattern                                                              | Severity | Impact                                                                                                                                                                                  |
| --------------- | ---- | -------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `middleware.ts` | 17   | Redirects to `/login` (not locale-prefixed `/ko/login`) on CVE block | Info     | May cause a redirect loop if `/login` itself triggers middleware; locale routing is handled below the CVE check so this is isolated to the non-locale path. Harmless for current setup. |

---

## Human Verification Required

### 1. Apply Migration 004 to Supabase and verify RLS enforcement

**Test:** Run `cd frontend && npx supabase db push`, then:

```
curl -H "apikey: <anon-key>" https://<project>.supabase.co/rest/v1/publications?is_public=eq.false
curl -H "apikey: <anon-key>" https://<project>.supabase.co/rest/v1/projects?is_public=eq.false
```

**Expected:** Both return `[]` (0 rows). A professor-role authenticated query returns all rows including private ones.
**Why human:** DB-level RLS behavior requires a live Supabase instance. The SQL is verified correct but cannot be executed programmatically here.

### 2. Verify update_publication_with_relations RPC is callable

**Test:** From professor-role session, call `supabase.rpc('update_publication_with_relations', { p_id: '<existing-id>', ... })` with valid data for an existing publication.
**Expected:** Returns no error; publication row and all three join tables updated in single transaction.
**Why human:** Requires live DB with the migration applied.

### 3. Confirm CVE-2025-29927 bypass blocked (regression check)

**Test:** With dev server running: `curl -v -H "x-middleware-subrequest: pages/internal/page" http://localhost:3000/internal 2>&1 | grep -E "HTTP|Location"`
**Expected:** `HTTP/1.1 307` with `Location: /login` (already approved in 01-04-SUMMARY — this is a regression checkpoint).
**Why human:** Requires running Next.js dev server.

---

## Gaps Summary

No gaps found. All automated checks pass. The only outstanding items are live-DB behavioral confirmations (DB-01, DB-02, DB-03) which require the migration to be applied to the Supabase project — the SQL content itself is complete and correct.

The SEC-02 "patents" mention in REQUIREMENTS.md is satisfied by `publications.ts` guards since patents are not a separate table or action file.

---

_Verified: 2026-03-15_
_Verifier: Claude (gsd-verifier)_
