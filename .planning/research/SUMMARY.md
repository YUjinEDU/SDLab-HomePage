# Project Research Summary

**Project:** SD Lab Homepage — 실적 구조 개편
**Domain:** University research lab homepage (Next.js 16 + Supabase) — content visibility control, cross-entity linking, RBAC
**Researched:** 2026-03-15
**Confidence:** HIGH

## Executive Summary

This is a focused enhancement milestone on an existing, working product. The base stack (Next.js 16 App Router, Supabase, Tailwind CSS v4) is fixed and well-suited. The three core deliverables are: (1) bidirectional project–output linking so visitors can trace a complete research lifecycle, (2) `is_public` content gating so sensitive records stay internal while the public story remains clean, and (3) `lib/permissions/` role-check utilities that properly guard all write operations. These three capabilities are tightly coupled by dependency — permissions must exist before gating, gating requires DB migration before queries, and linking safely requires transactional join-table updates.

The recommended approach is sequential at the foundation layer but parallelizable at the feature layer. DB migration (`is_public` column + RLS policies) must land first because every subsequent query change depends on it. `lib/permissions/index.ts` must be written second because every Server Action hardening step imports it. After those two foundations are in place, the query updates, new UI components, and professor-portal toggles can proceed in parallel streams.

The dominant risk is the current security posture: `lib/permissions/` is confirmed empty in the codebase, meaning any authenticated `member` can today call professor/admin Server Actions directly. CVE-2025-29927 further exposes middleware-only auth to header spoofing. This is not a future risk — it is an active gap that must be closed in Phase 1 before any feature work proceeds. A secondary risk is silent data loss from the existing non-transactional delete-then-insert pattern on join tables; this must be replaced with Supabase RPC (PostgreSQL transaction) when adding new project-output links.

## Key Findings

### Recommended Stack

The stack requires no new framework decisions. Three specific patterns need to be adopted: Supabase RLS with explicit anon/authenticated policy split for `is_public` enforcement; `@supabase/ssr`'s `auth.getUser()` (never `getSession()`) for all server-side role checks; and Supabase RPC for any multi-step join table mutation. The only new dependency worth adding is `zod` for Server Action input validation — the codebase currently has no input validation layer, and adding it alongside the permissions hardening is low cost and high value.

**Core technologies:**

- Supabase RLS: DB-level `is_public` enforcement — anon key cannot bypass it even if app-layer query omits the filter
- `@supabase/ssr` `auth.getUser()`: server-side role verification — `getSession()` reads unvalidated cookie and must never be used for auth decisions
- Next.js Server Actions: write operation entry points — `assertRole()` called as first statement, before any DB operation
- Supabase RPC: transactional join table updates — JavaScript client has no multi-statement transaction support
- `zod` ^3.x: Server Action input validation — add alongside permissions hardening

### Expected Features

The project already implements all table-stakes features (publications list, member list, research areas, contact). The gap in table stakes is mobile layout quality on output cards/lists. The three differentiating features — project-output linking, `is_public` gating, and SW registration as a first-class output — are what separate this site from typical Korean university lab homepages that have no cross-linking and no access control.

**Must have (table stakes — this milestone):**

- Project detail page shows linked publications, patents, SW registrations — core value of the milestone
- Publication/patent detail shows "연계 과제" back-link — bidirectional navigation
- `lib/permissions/` role check utilities — foundational security correctness
- `is_public` field on publications and projects with RLS gating — sensitive content control
- Server Actions permission checks — closes confirmed active security gap
- Mobile layout fix for output cards/lists — only remaining table-stakes gap

**Should have (v1.x after validation):**

- Professor portal UI toggle for `is_public` per record (currently requires direct DB edit)
- SW registration location finalized pending professor feedback (default: Projects tab with badge)

**Defer (v2+):**

- Bilingual output titles (EN/KO per field) — high value, high complexity, explicitly out of scope
- ORCID/CrossRef bulk import — only if manual entry becomes the bottleneck

### Architecture Approach

The architecture is a strict layered system: Routing → Permissions → Query (reads) / Actions (writes) → Supabase + RLS. The `lib/permissions/index.ts` module is the central authority — it exports `assertRole()` for Server Actions (returns error object, never redirects) and `requireRole()` for layouts (redirects on failure). All public-facing queries use a separate client (`createStaticClient` with anon key) so RLS automatically restricts to `is_public = true` rows; all internal queries use the session-based client. DB migration 004 (`is_public` columns + RLS policies) is the hard prerequisite for everything else.

**Major components:**

1. `lib/permissions/index.ts` — central role-check utilities; currently empty, must be implemented in Phase 1
2. `Migration 004_add_is_public.sql` — adds `is_public BOOLEAN NOT NULL DEFAULT TRUE` to publications and projects + updates RLS policies; gates all subsequent query work
3. `lib/queries/projects.ts` + `lib/queries/publications.ts` — extended with `is_public` filters and new `getProjectOutputs(slug)` / `getProjectSummariesByIds()` functions
4. `ProjectOutputsSection` (new component) — tabbed UI showing Publications / Patents / SW linked to a project; reuses existing card components
5. `ProjectBacklink` (new component) — small link card on pub/patent detail page pointing back to associated project
6. Server Actions hardening — `assertRole(['professor', 'admin'])` added as first call in every write action

### Critical Pitfalls

1. **Middleware-only authorization (CVE-2025-29927, CVSS 9.1)** — Implement `lib/permissions/` and call `assertRole()` as the first statement in every write action. Middleware is a UX gate, not a security gate. Fix the silent `NextResponse.next()` bypass in `lib/db/middleware.ts` when `NEXT_PUBLIC_SUPABASE_URL` is missing.

2. **Non-transactional join table updates cause silent data loss** — The current delete-then-insert pattern in `actions/publications.ts` already exists as a live bug. For new project-output linking, use `supabase.rpc('replace_publication_projects', ...)` wrapped in a PostgreSQL function. Audit and migrate existing join table mutations simultaneously.

3. **RLS missing means anon key bypasses `is_public` filter** — Application-layer `.eq('is_public', true)` filtering provides zero protection if RLS is not enabled. The anon key is public in the browser bundle and directly accesses the Supabase REST API. RLS policies must be part of migration 004, not a separate step.

4. **Next.js cache serves stale `is_public` state** — Tag public queries with `{ next: { tags: ['publications', 'projects'] } }` and call `revalidateTag()` in every Server Action that modifies `is_public`. Without this, toggling a record private in the professor portal does not immediately remove it from public pages.

5. **`getSession()` instead of `getUser()` for server-side auth** — `getSession()` reads the cookie without server-side validation and can be spoofed. `lib/permissions/index.ts` must use `auth.getUser()` exclusively. Role should be read from the `profiles` table, not from JWT claims.

## Implications for Roadmap

Based on research, the hard dependency chain dictates a 4-phase structure:

### Phase 1: Security Foundation + DB Schema

**Rationale:** The `lib/permissions/` module is currently empty — this is a confirmed active security gap. No feature work should proceed until Server Actions are properly guarded. The DB migration must also land in this phase because every query change in later phases depends on the `is_public` column existing.
**Delivers:** Secure write operations across all Server Actions; `is_public` column + RLS policies on publications and projects tables; `lib/permissions/index.ts` with `assertRole()` and `requireRole()`
**Addresses:** FEATURES.md Server Actions permission checks; FEATURES.md `is_public` foundation
**Avoids:** CVE-2025-29927 middleware bypass; `getSession()` spoofing; anon key data exposure via missing RLS

### Phase 2: Query Layer + `is_public` Visibility

**Rationale:** With the DB column and permissions layer in place, public query functions can be safely updated to filter by `is_public`. This phase completes the visibility control feature end-to-end (DB + query + cache invalidation).
**Delivers:** Updated `getPublications()`, `getProjects()`, `getPatents()` with `is_public` filter; `revalidateTag()` wired to write actions; internal query variants without the filter for the professor portal
**Uses:** Supabase RLS (Phase 1 migration), `next: { tags }` cache tagging, `revalidateTag()` in actions
**Avoids:** Stale cache pitfall; `is_public` UI-only filtering anti-pattern

### Phase 3: Project–Output Cross-Linking

**Rationale:** The `publication_projects` join table already exists. This phase adds the query functions and UI components to surface bidirectional links. Must use RPC transactions for any join table mutations to avoid the silent data loss pitfall.
**Delivers:** `getProjectOutputs(slug)` query function; `getProjectSummariesByIds()` for back-reference; `ProjectOutputsSection` component (tabbed publications/patents/SW on project detail); `ProjectBacklink` component (project card on pub/patent detail); mobile layout fixes for output lists
**Implements:** Architecture components 3, 4, 5 from ARCHITECTURE.md
**Avoids:** Non-transactional join update data loss; N+1 query trap (use Supabase `!inner` nested select)

### Phase 4: Professor Portal — Content Management UX

**Rationale:** The `is_public` toggle currently requires direct DB access. This phase adds the UI so the professor can manage visibility without engineering involvement. SW registration location decision and migration 005 land here after professor feedback.
**Delivers:** `is_public` toggle UI in professor portal for publications and projects; SW registration table or schema extension (pending location decision); professor portal CRUD validated with new permission guards
**Addresses:** FEATURES.md v1.x items — professor `is_public` toggle, SW registration finalization

### Phase Ordering Rationale

- Phase 1 must come first: `lib/permissions/` is imported by actions in all subsequent phases; DB migration is the prerequisite for all `is_public` query changes
- Phase 2 before Phase 3: query functions updated in Phase 2 become the foundation that `getProjectOutputs` builds on in Phase 3
- Phase 4 last: it is additive UX on top of a fully-functional data layer; deferring until professor feedback on SW location avoids building the wrong UI
- Phases 2 and 3 have some parallel work possible (query updates are independent of component development) but Phase 3 must not deploy until Phase 2's `is_public` filters are live

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 3:** Supabase `!inner` nested select syntax for `publication_projects` join — ARCHITECTURE.md has a pattern but it should be validated against the actual schema before implementation
- **Phase 4:** SW registration schema decision (new table vs. extend publications) — needs professor input before migration 005 is written; Option A (new `sw_registrations` table) is recommended but must be confirmed

Phases with standard patterns (skip research-phase):

- **Phase 1:** Well-documented pattern. `lib/permissions/` structure is fully specified in ARCHITECTURE.md; `auth.getUser()` vs `getSession()` is official Supabase guidance
- **Phase 2:** Standard Next.js cache tagging with `revalidateTag()` — no novel patterns

## Confidence Assessment

| Area         | Confidence | Notes                                                                                                                                    |
| ------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH       | Existing stack confirmed; patterns from official Supabase and Next.js docs; no new framework decisions                                   |
| Features     | MEDIUM     | Table-stakes and differentiators well-reasoned; SW registration location pending professor feedback                                      |
| Architecture | HIGH       | Based on direct codebase inspection; build order dependencies confirmed by actual import graph                                           |
| Pitfalls     | HIGH       | CVE confirmed via official security advisory; data loss bug confirmed by codebase analysis; Supabase caching behavior from official docs |

**Overall confidence:** HIGH

### Gaps to Address

- **SW registration location (Projects tab vs. standalone):** Resolve with professor before Phase 4 begins. Default assumption is Projects tab with badge — do not block Phases 1–3 on this.
- **RLS policy existence in current schema:** PITFALLS.md notes policies are "not confirmed" in migrations. Verify `001_initial_schema.sql` and `002`/`003` migration files before writing migration 004 to avoid policy conflicts.
- **`profiles` table role column name:** ARCHITECTURE.md assumes `profiles.role`. Confirm actual column name before writing `assertRole()` to avoid a silent auth failure.

## Sources

### Primary (HIGH confidence)

- [Supabase Row Level Security Docs](https://supabase.com/docs/guides/database/postgres/row-level-security) — anon/authenticated RLS policy split
- [Supabase Setting up Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) — `getUser()` vs `getSession()` server usage
- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication) — middleware as UX gate, not security gate
- [CVE-2025-29927 / GHSA-f82v-jwr5-mffw](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw) — Next.js middleware authorization bypass
- [Supabase: Next.js stale data when changing RLS](https://supabase.com/docs/guides/troubleshooting/nextjs-1314-stale-data-when-changing-rls-or-table-data-85b8oQ) — cache + RLS interaction
- Codebase direct analysis: `frontend/supabase/migrations/`, `frontend/src/lib/queries/`, `frontend/src/actions/`, `.planning/codebase/CONCERNS.md`

### Secondary (MEDIUM confidence)

- [MIT CSAIL Research](https://www.csail.mit.edu/research) — project→paper cross-linking as lab site pattern
- [SKKU IRIS Lab](https://iris.skku.edu/) — Korean lab site structure reference
- [postgrest-js #240](https://github.com/supabase/postgrest-js/issues/240) — no transaction support in JS client (community confirmed)
- [Next.js RBAC with App Router - jigz.dev](https://www.jigz.dev/blogs/how-to-implement-role-based-access-control-rbac-in-next-js-app-router) — `lib/permissions` centralization pattern (validated against Next.js official docs)

---

_Research completed: 2026-03-15_
_Ready for roadmap: yes_
