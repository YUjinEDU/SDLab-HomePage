# Pitfalls Research

**Domain:** Next.js 16 + Supabase — content visibility, cross-entity linking, RBAC
**Researched:** 2026-03-15
**Confidence:** HIGH (codebase issues confirmed; CVE and Supabase behavior from official docs)

---

## Critical Pitfalls

### Pitfall 1: Middleware-Only Authorization (CVE-2025-29927)

**What goes wrong:**
All write operations rely on `middleware.ts` to block unauthenticated requests. If middleware is bypassed — via the `x-middleware-subrequest` header exploit (CVE-2025-29927, CVSS 9.1) or via misconfigured `NEXT_PUBLIC_SUPABASE_URL` (silent `NextResponse.next()` passthrough confirmed in `lib/db/middleware.ts`) — every Server Action is fully exposed. Any authenticated `member` can already call professor/admin actions today.

**Why it happens:**
Server Actions look like internal functions. Developers protect routes via middleware and assume the UI restriction is the security boundary. But every `"use server"` function creates a public HTTP endpoint callable with `fetch()` or `curl`.

**How to avoid:**

- Implement `lib/permissions/index.ts` with `requireRole(supabase, ['professor', 'admin'])` helper
- Call it as the **first statement** in every write action before any DB operation
- Never treat middleware as the sole auth gate — it is a UX gate, not a security gate
- Fix the silent bypass in `lib/db/middleware.ts` lines 7-10: replace `NextResponse.next()` fallback with an explicit error redirect when `NEXT_PUBLIC_SUPABASE_URL` is missing

**Warning signs:**

- Any write Server Action that does not call `supabase.auth.getUser()` at the top
- `lib/permissions/` directory is empty (confirmed in codebase)
- Role checks only appear in `layout.tsx` files, not in `actions/`

**Phase to address:** Phase implementing `lib/permissions/` and Server Action hardening (should be the first phase — all subsequent feature work depends on it being safe)

---

### Pitfall 2: Non-Transactional Join Table Updates Cause Silent Data Loss

**What goes wrong:**
The current pattern in `actions/publications.ts` (lines 152–187) and `actions/projects.ts` is: update main row → DELETE join rows → INSERT join rows. These are three separate Supabase JS calls. The Supabase JS client does not support multi-statement transactions. If the INSERT step fails (network error, constraint violation, RLS rejection), the DELETE has already committed — publication authors, research area links, and project-output links are permanently wiped with no error surfaced to the user.

**Why it happens:**
Supabase JS has no `.transaction()` API. The delete-then-insert pattern is the most common answer found in documentation and community examples, and the failure mode only appears under specific error conditions that don't occur in normal development.

**How to avoid:**

- Wrap multi-step join updates in a PostgreSQL function called via `supabase.rpc()`
- The RPC function executes inside a real PostgreSQL transaction; any step failure rolls back all steps
- Alternatively: use upsert with conflict resolution instead of delete-then-insert, avoiding the destructive DELETE step entirely
- When adding `project_outputs` join table for Project→Publication/Patent linking, use RPC from day one — do not use the delete-then-insert pattern

**Warning signs:**

- Any action that calls `.delete()` on a join table followed by `.insert()` in sequential awaits
- No `try/catch` wrapping both operations together
- User reports of "authors disappeared" or "linked publications gone" after edits

**Phase to address:** Phase adding Project→output cross-entity linking (must use RPC transactions for the new join table; existing join tables should be migrated simultaneously)

---

### Pitfall 3: Next.js Data Cache Serves Stale is_public State

**What goes wrong:**
Next.js App Router aggressively caches `fetch()` responses and Server Component renders. When `is_public` is toggled for a publication or project (from `true` to `false`), the cached public page continues serving the now-private content until the cache expires or is manually revalidated. Conversely, newly-published content may not appear immediately. This is confirmed behavior with Supabase + Next.js documented by Supabase themselves.

**Why it happens:**
`@supabase/ssr` uses cookies and opts out of Next.js fetch caching for authenticated requests, but **anonymous (public) fetches** may still be cached by Next.js. The `is_public` filter is applied at query time, but if the query result is cached, the filter result is also cached.

**How to avoid:**

- Tag all queries that filter by `is_public` with `{ next: { tags: ['publications', 'projects'] } }` in fetch options
- Call `revalidateTag('publications')` (or equivalent) in the Server Action that updates `is_public`
- For the internal portal, use `cache: 'no-store'` to always get live data
- Confirm `@supabase/ssr` is used (not `@supabase/supabase-js` directly) — it opts out of Next.js caching via cookies

**Warning signs:**

- Public pages showing content after it has been marked `is_public = false`
- Newly added content not appearing on public pages until server restart
- Supabase queries in public page components not passing `next: { tags: [...] }`

**Phase to address:** Phase adding `is_public` DB column and public visibility filtering

---

### Pitfall 4: RLS Policies Missing — anon Key Bypasses is_public Filter

**What goes wrong:**
If Supabase Row Level Security is not enabled on tables, the anon key can read all rows regardless of `is_public`. Adding an `is_public` column and filtering it in application code (`where is_public = true`) provides zero protection if someone queries Supabase directly with the anon key (which is public in the browser bundle). The codebase analysis confirms RLS policies are not confirmed to exist in migrations.

**Why it happens:**
Developers add an `is_public` application-layer filter and consider the feature complete. They do not realize the anon key exposes a direct REST API to every Supabase table at `https://<project>.supabase.co/rest/v1/<table>`.

**How to avoid:**

- Enable RLS on all tables: `ALTER TABLE publications ENABLE ROW LEVEL SECURITY`
- Add an explicit anon read policy: `CREATE POLICY "Public can read public content" ON publications FOR SELECT TO anon USING (is_public = true)`
- For internal-only tables (member details, contact info), add no anon SELECT policy at all
- Implement application-layer filter AND RLS — defense in depth
- Verify policies exist in migration files before marking the `is_public` feature complete

**Warning signs:**

- Migration files contain `CREATE TABLE` but no `CREATE POLICY` or `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- `curl https://<project>.supabase.co/rest/v1/publications -H "apikey: <anon_key>"` returns all rows including non-public ones

**Phase to address:** Same phase as `is_public` DB schema addition — RLS policies are part of the migration, not a later task

---

### Pitfall 5: getSession() Instead of getUser() for Server-Side Auth

**What goes wrong:**
`supabase.auth.getSession()` returns data from the cookie without server-side validation. It can be spoofed. Any permission check that calls `getSession()` to get the user's role on the server can be bypassed by a crafted cookie. Supabase's official documentation explicitly states this is the most common auth mistake in Next.js SSR.

**Why it happens:**
`getSession()` is simpler and faster (no network call). The distinction between `getSession()` (reads cookie) and `getUser()` (validates with Supabase auth server) is not obvious from the API surface.

**How to avoid:**

- In `lib/permissions/index.ts`, always use `supabase.auth.getUser()` — never `getSession()`
- `getSession()` is acceptable only for UI rendering hints (e.g., show/hide login button) — never for authorization decisions
- The `requireRole()` helper should call `getUser()` then query the `profiles` table for the role

**Warning signs:**

- Any Server Action or permission check using `supabase.auth.getSession()` to determine role
- Role checks that read `session.user.user_metadata.role` instead of querying the `profiles` table

**Phase to address:** Phase implementing `lib/permissions/` — establish the correct pattern once, used everywhere

---

## Technical Debt Patterns

| Shortcut                                  | Immediate Benefit     | Long-term Cost                                            | When Acceptable                                  |
| ----------------------------------------- | --------------------- | --------------------------------------------------------- | ------------------------------------------------ |
| Role check in `layout.tsx` only           | Fast to implement     | `layout.tsx` runs once; Server Actions bypass it entirely | Never for write operations                       |
| Delete-then-insert for join updates       | Simple code           | Silent data loss on partial failure                       | Never — use upsert or RPC                        |
| `is_public` filter in JS only, no RLS     | Avoids migration      | anon key exposes all data via REST                        | Never                                            |
| Static `data/` files alongside DB queries | Easy seeding          | Stale data served if component imports wrong source       | Only during initial prototyping, must be removed |
| `getSession()` for role checks            | No network round-trip | Role check can be spoofed via cookie manipulation         | Never for authorization decisions                |

---

## Integration Gotchas

| Integration                    | Common Mistake                                                                 | Correct Approach                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Supabase + Next.js caching     | Public queries cached indefinitely; `is_public` toggle has no immediate effect | Tag queries with `next: { tags }`, call `revalidateTag()` in write actions                       |
| Supabase RLS + anon key        | Assuming app-layer `is_public` filter is sufficient                            | Enable RLS + write explicit anon SELECT policies gated on `is_public = true`                     |
| Server Actions + Supabase Auth | Using service role key in Server Actions (bypasses RLS entirely)               | Use per-request SSR client with user's cookie; only use service role in trusted server-only jobs |
| Next.js middleware + auth      | Treating middleware as the security layer (CVE-2025-29927)                     | Middleware = UX convenience; Server Actions must re-verify auth independently                    |
| Supabase multi-step mutations  | Sequential JS calls treated as a transaction                                   | Use `supabase.rpc()` to call a PostgreSQL function that wraps operations in a real transaction   |

---

## Performance Traps

| Trap                                   | Symptoms                                                                                      | Prevention                                                                                | When It Breaks                              |
| -------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| N+1 queries for project→output links   | Member detail page or project detail page is slow; each linked item triggers a separate query | Rewrite as single Supabase nested select: `projects(*, project_outputs(publications(*)))` | ~20+ linked items per entity                |
| `getPublications()` without pagination | Publications page slow on load; Supabase query costs increase linearly                        | Add `.range(from, to)` with server-side pagination before the list grows                  | ~100+ publications                          |
| No `revalidateTag()` on write actions  | Cache never invalidated; content changes not reflected                                        | Always pair write actions with `revalidateTag()` for affected data tags                   | Immediately after first write in production |

---

## Security Mistakes

| Mistake                                          | Risk                                                                          | Prevention                                                                                   |
| ------------------------------------------------ | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Server Actions without `requireRole()`           | `member` role can write/delete any content (confirmed in codebase)            | Add role check as first line of every write action                                           |
| No RLS on Supabase tables                        | Direct anon key access exposes all data including `is_public = false` records | Enable RLS; write explicit policies per table per role                                       |
| `getSession()` for authorization                 | Role can be spoofed via cookie                                                | Use `getUser()` only for auth decisions                                                      |
| Silent middleware bypass on missing env var      | `/internal` and `/professor` routes exposed in misconfigured deploys          | Replace `NextResponse.next()` fallback with explicit error; assert env vars at startup       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` in public bundle | Visible to anyone; must not grant write access                                | Ensure all write paths are blocked by RLS; anon key should only read `is_public = true` rows |

---

## "Looks Done But Isn't" Checklist

- [ ] **is_public filtering:** `is_public = true` query added in `lib/queries/` — verify RLS policy ALSO enforces this at DB layer
- [ ] **Server Action auth:** Role check UI added in `layout.tsx` — verify the corresponding `actions/` file has `requireRole()` at the top
- [ ] **Join table linking:** Project→Publication link UI works in dev — verify failure case (DB constraint error during INSERT) does not leave join table partially deleted
- [ ] **Cache invalidation:** `is_public` toggle works in professor portal — verify public page reflects change without server restart
- [ ] **lib/permissions/ implemented:** `requireRole()` function exists — verify it calls `getUser()` not `getSession()` and queries `profiles` table not JWT claims
- [ ] **RLS migrations:** New `is_public` column added — verify `CREATE POLICY` statements exist in the same migration file

---

## Recovery Strategies

| Pitfall                                        | Recovery Cost | Recovery Steps                                                                                                      |
| ---------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Join table data wiped by partial failure       | HIGH          | Restore from Supabase point-in-time backup; audit which records lost author/project links; manual re-entry          |
| Stale cached content after `is_public` toggle  | LOW           | Run `revalidatePath()` manually or restart server; add `revalidateTag()` to action going forward                    |
| Member role exploiting unguarded Server Action | HIGH          | Audit Supabase logs for unexpected writes; roll back affected rows; add `requireRole()` immediately                 |
| RLS missing — data exposed via anon key        | MEDIUM        | Enable RLS immediately (causes all public reads to break until policies added); add policies in emergency migration |

---

## Pitfall-to-Phase Mapping

| Pitfall                                         | Prevention Phase                                       | Verification                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Middleware-only auth / Server Actions unguarded | Phase 1: `lib/permissions/` implementation             | Each write action has `requireRole()` as first call; confirmed by code review                |
| Non-transactional join table updates            | Phase adding Project→output linking                    | New join table uses RPC; existing join tables audited                                        |
| Stale cache after `is_public` toggle            | Phase adding `is_public` column + visibility filtering | Toggle in professor portal; verify public page updates within one request                    |
| RLS missing on tables                           | Phase adding `is_public` DB schema                     | `supabase.co/rest/v1/publications?apikey=<anon>` returns only `is_public=true` rows          |
| `getSession()` for authorization                | Phase 1: `lib/permissions/` implementation             | `requireRole()` implementation uses `getUser()`; grep confirms no `getSession()` in actions/ |
| Static `data/` files conflicting with DB        | Phase 1 or housekeeping before feature work            | `grep -r "from.*data/"` in components/ returns no results                                    |

---

## Sources

- [Next.js Data Security Guide](https://nextjs.org/docs/app/guides/data-security) — Server Actions are public endpoints
- [CVE-2025-29927: Next.js Middleware Authorization Bypass (JFrog)](https://jfrog.com/blog/cve-2025-29927-next-js-authorization-bypass/) — Middleware bypass via header spoofing
- [GitHub Advisory GHSA-f82v-jwr5-mffw](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw) — Official Next.js security advisory
- [Supabase: Next.js 13/14 stale data when changing RLS or table data](https://supabase.com/docs/guides/troubleshooting/nextjs-1314-stale-data-when-changing-rls-or-table-data-85b8oQ) — Caching + RLS conflict
- [postgrest-js #240: Transactional update with relationships](https://github.com/supabase/postgrest-js/issues/240) — No transaction support in JS client
- [MakerKit: Next.js Server Actions Security](https://makerkit.dev/blog/tutorials/secure-nextjs-server-actions) — 5 vulnerabilities pattern
- [Supabase: RLS Performance and Best Practices](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)
- Codebase analysis: `.planning/codebase/CONCERNS.md` (2026-03-14) — confirmed issues

---

_Pitfalls research for: SD Lab Homepage — 실적 구조 개편 (Next.js 16 + Supabase)_
_Researched: 2026-03-15_
