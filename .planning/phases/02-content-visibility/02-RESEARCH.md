# Phase 2: Content Visibility - Research

**Researched:** 2026-03-15
**Domain:** Next.js App Router caching + Supabase query filtering
**Confidence:** HIGH

## Summary

Phase 2 has two tightly scoped tasks: (1) add `.eq("is_public", true)` filters to the public-facing query functions in `lib/queries/`, and (2) replace `revalidatePath()` calls in write actions with `revalidateTag()` so that cache invalidation is precise and immediate after visibility changes.

The RLS foundation is already in place from Phase 1 (DB-02: anon role RLS policy on `is_public = true`). The query-layer filter (VIS-01) is a defense-in-depth measure and makes internal-portal queries explicit by using separate query functions or omitting the filter. The cache migration (VIS-02) ensures a professor toggling `is_public` in the portal causes the public listing to update on the next browser refresh.

The current codebase uses `revalidatePath("/publications")` etc. in actions. Switching to `revalidateTag("publications")` requires tagging the `fetch` or `unstable_cache` call at the query layer. Since the queries use the Supabase JS client directly (not native `fetch` with tags), the correct pattern is `unstable_cache` with an explicit tag array.

**Primary recommendation:** Wrap each public query with `unstable_cache(..., { tags: ["publications"] })`, and call `revalidateTag("publications")` in every write action that touches that table.

<phase_requirements>

## Phase Requirements

| ID     | Description                                                                                              | Research Support                                               |
| ------ | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| VIS-01 | 공개 쿼리 함수(`lib/queries/`)에 `is_public = true` 필터 적용 — 비로그인 방문자에게 비공개 콘텐츠 미노출 | Query audit below identifies every function needing the filter |
| VIS-02 | `next/cache` `revalidateTag()` 태그 기반 캐시 무효화 — write action 후 is_public 변경이 즉시 반영        | `unstable_cache` + `revalidateTag` pattern documented below    |

</phase_requirements>

## Standard Stack

### Core

| Library                                          | Version                      | Purpose                                  | Why Standard                                |
| ------------------------------------------------ | ---------------------------- | ---------------------------------------- | ------------------------------------------- |
| `next/cache` (`unstable_cache`, `revalidateTag`) | Next.js 15 (project uses 16) | Tag-based cache + on-demand invalidation | Built into Next.js; no extra dependency     |
| `@supabase/ssr`                                  | already installed            | Server-side Supabase client              | Project standard (`lib/db/supabase-server`) |

### Supporting

| Library          | Version          | Purpose                 | When to Use                                                                 |
| ---------------- | ---------------- | ----------------------- | --------------------------------------------------------------------------- |
| `revalidatePath` | Next.js built-in | Path-based invalidation | Keep for non-visibility mutations (create/delete) alongside `revalidateTag` |

**Installation:** No new packages required.

## Architecture Patterns

### Recommended Project Structure

No new folders needed. Changes are confined to:

```
frontend/src/
  lib/queries/
    publications.ts   # add is_public filter + unstable_cache tags
    projects.ts       # add is_public filter + unstable_cache tags
  actions/
    publications.ts   # revalidatePath → revalidateTag
    projects.ts       # revalidatePath → revalidateTag
```

### Pattern 1: Public Query with is_public Filter + unstable_cache Tag

**What:** Wrap public query in `unstable_cache` with a named tag; apply `.eq("is_public", true)` inside.

**When to use:** Any query function called from a public (`(public)/[locale]/`) page.

```typescript
// lib/queries/publications.ts
import { unstable_cache } from "next/cache";

export const getPublications = unstable_cache(
  async (): Promise<Publication[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("publications")
      .select(PUB_SELECT)
      .eq("is_public", true) // VIS-01: public filter
      .neq("type", "patent")
      .order("year", { ascending: false })
      .order("month", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(toPublication);
  },
  ["publications-public"], // cache key segment
  { tags: ["publications"] }, // invalidation tag
);
```

### Pattern 2: Internal Query (No Filter)

**What:** Functions called from `(internal)/` or `(professor)/` omit the `is_public` filter and are NOT wrapped in `unstable_cache` (or use a separate tag).

**When to use:** Professor portal list pages, internal portal project list.

```typescript
// lib/queries/publications.ts
// getAllPublications — professor portal, no filter
export async function getAllPublications(): Promise<Publication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select(PUB_SELECT)
    .order("year", { ascending: false })
    .order("month", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toPublication);
}
```

### Pattern 3: revalidateTag in Write Actions

**What:** After any write that may change `is_public`, call `revalidateTag` with the table's tag.

```typescript
// actions/publications.ts
import { revalidatePath, revalidateTag } from "next/cache";

// Inside createPublication / updatePublication / deletePublication:
revalidateTag("publications"); // VIS-02: invalidates unstable_cache
revalidatePath("/professor/publications");
revalidatePath("/professor/patents");
```

### Anti-Patterns to Avoid

- **Filter only at app layer, skip unstable_cache:** `revalidatePath` does not invalidate `unstable_cache` entries — the tag approach is required.
- **Wrap internal queries in the same cache tag:** Internal portal would then serve stale data and never see newly hidden items.
- **Adding `is_public` filter to `getAllPublications` / `getPublicationById`:** These are used by the professor portal and must see all records.

## Affected Query Functions Audit

### publications.ts — Functions Needing is_public Filter (VIS-01)

| Function                    | Called From                   | Needs Filter?                                                      |
| --------------------------- | ----------------------------- | ------------------------------------------------------------------ |
| `getPublications()`         | public `/publications` page   | YES                                                                |
| `getPublicationBySlug()`    | public `/publications/[slug]` | YES                                                                |
| `getFeaturedPublications()` | public home page              | YES                                                                |
| `getPatents()`              | public `/patents` page        | YES — currently behind `AccessDenied` gate, but still needs filter |
| `getPatentBySlug()`         | public `/patents/[slug]`      | YES                                                                |
| `getAllPublications()`      | professor portal              | NO — sees all                                                      |
| `getPublicationById()`      | professor portal edit         | NO — sees all                                                      |
| `getPublicationsByMember()` | member profile                | CONDITIONAL — public profile: YES; internal: NO                    |

### projects.ts — Functions Needing is_public Filter (VIS-01)

| Function                | Called From               | Needs Filter?                                                  |
| ----------------------- | ------------------------- | -------------------------------------------------------------- |
| `getProjects()`         | public `/projects` page   | YES — currently behind `AccessDenied` gate, still needs filter |
| `getProjectBySlug()`    | public `/projects/[slug]` | YES                                                            |
| `getFeaturedProjects()` | public home page          | YES                                                            |
| `getActiveProjects()`   | possibly public           | YES                                                            |
| `getProjectById()`      | professor portal edit     | NO — sees all                                                  |
| `getDemoProjects()`     | public demos page         | YES                                                            |
| `getProjectsByMember()` | member profile            | CONDITIONAL                                                    |

**Note:** The current public `/projects` and `/patents` pages use `AccessDenied` for non-logged-in users (per `page.tsx` files read above). The `is_public` filter is still required because: (a) this is defense-in-depth per RLS policy, and (b) the success criteria explicitly state visitors must not see `is_public = false` items. The `AccessDenied` gate should be _removed_ or changed so that public visitors see public items — this is a key design decision for the planner.

## Don't Hand-Roll

| Problem                | Don't Build                                | Use Instead                                   | Why                                                            |
| ---------------------- | ------------------------------------------ | --------------------------------------------- | -------------------------------------------------------------- |
| Cache tag registration | Custom cache layer                         | `unstable_cache` with `tags` option           | Built-in, works with `revalidateTag`                           |
| On-demand invalidation | Time-based revalidation (`revalidate: 60`) | `revalidateTag()` in Server Actions           | Time-based would delay visibility changes by up to TTL seconds |
| Row-level visibility   | App-layer-only filter                      | DB RLS (already done in Phase 1) + app filter | Defense in depth; app filter catches bugs before DB            |

**Key insight:** `revalidatePath` only works for route segment cache, not for `unstable_cache` entries. The two must be used together or `revalidateTag` must be used exclusively.

## Common Pitfalls

### Pitfall 1: revalidatePath Does Not Clear unstable_cache

**What goes wrong:** Developer adds `unstable_cache` but keeps `revalidatePath` only. Cache never invalidates on write, so old data persists indefinitely.
**Why it happens:** The two cache systems are independent in Next.js.
**How to avoid:** Always pair `unstable_cache` + `revalidateTag` together. Add `revalidateTag` alongside existing `revalidatePath` calls.
**Warning signs:** Public page shows stale data after professor update.

### Pitfall 2: Filtering getAllPublications / getPublicationById

**What goes wrong:** Adding `is_public = true` to `getAllPublications` breaks the professor portal (professor can't see their own hidden items).
**How to avoid:** Maintain separate public vs. admin query paths. Naming convention: `getPublications` (public, filtered) vs. `getAllPublications` (admin, unfiltered).

### Pitfall 3: Projects/Patents Pages Have AccessDenied Gate

**What goes wrong:** VIS-01 success criteria says non-logged-in visitors should see `is_public = true` items in the list — but current `/projects` and `/patents` pages block non-logged-in users entirely with `AccessDenied`.
**Why it happens:** Projects were historically private (see memory note: `project_page_access_control.md`).
**How to avoid:** Planner must decide: either (a) remove the `AccessDenied` gate so public visitors see filtered results, or (b) keep the gate and clarify that VIS-01 only applies to publications. This is an open question below.

### Pitfall 4: unstable_cache with Async createClient

**What goes wrong:** `unstable_cache` executes the function in a context where request-scoped cookies may not be available if the client is created inside.
**How to avoid:** `createClient()` in the project uses `@supabase/ssr` with `cookies()` — this is request-scoped and should be called inside the cached function, not outside. Verify that the anon client (not the session client) is used for public queries.

## Code Examples

### Complete Pattern: Public getPublications with Cache Tag

```typescript
// Source: Next.js docs — unstable_cache API
import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/db/supabase-server";

export const getPublications = unstable_cache(
  async (): Promise<Publication[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("publications")
      .select(PUB_SELECT)
      .eq("is_public", true)
      .neq("type", "patent")
      .order("year", { ascending: false })
      .order("month", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(toPublication);
  },
  ["publications-public"],
  { tags: ["publications"] },
);
```

### Complete Pattern: Action with revalidateTag

```typescript
// actions/publications.ts — after successful write:
import { revalidatePath, revalidateTag } from "next/cache";

revalidateTag("publications");
revalidatePath("/professor/publications");
revalidatePath("/professor/patents");
```

### Separate Tag for Projects

```typescript
// lib/queries/projects.ts
export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    /* ... with .eq("is_public", true) */
  },
  ["projects-public"],
  { tags: ["projects"] },
);

// actions/projects.ts — after write:
revalidateTag("projects");
revalidatePath("/professor/projects");
revalidatePath("/projects");
```

## State of the Art

| Old Approach                        | Current Approach                                         | When Changed              | Impact                                                 |
| ----------------------------------- | -------------------------------------------------------- | ------------------------- | ------------------------------------------------------ |
| `revalidatePath` only               | `revalidatePath` + `revalidateTag` with `unstable_cache` | Next.js 14+               | Tag-based allows fine-grained, immediate invalidation  |
| `fetch` cache with `next: { tags }` | `unstable_cache` with `tags`                             | Next.js 14 (stable in 15) | Works with non-fetch data sources like Supabase client |

**Note:** `unstable_cache` is marked "unstable" in the API name but is the official recommended pattern for non-fetch caching in Next.js 14/15. It is production-safe.

## Open Questions

1. **Should /projects and /patents be opened to non-logged-in visitors?**
   - What we know: Both pages currently show `AccessDenied` to logged-out users. VIS-01 success criteria says non-logged-in visitors should not see `is_public = false` items (implying they CAN see `is_public = true` items).
   - What's unclear: Whether the intent is to open these pages publicly (filtering by `is_public`) or keep them member-only (in which case VIS-01 only applies to publications).
   - Recommendation: Planner should assume VIS-01 means opening these pages and applying the filter. The `AccessDenied` gate should be removed for `/projects` and `/patents`. If the memory note (`project_page_access_control.md`) indicates otherwise, planner should respect that constraint.

2. **`getPublicationsByMember` / `getProjectsByMember` filtering**
   - What we know: These are used on member profile pages, which may be public.
   - What's unclear: Whether member profiles are public-facing and need `is_public` filtering.
   - Recommendation: Apply `is_public = true` filter here as well for safety.

## Validation Architecture

### Test Framework

| Property           | Value                                                                   |
| ------------------ | ----------------------------------------------------------------------- |
| Framework          | Vitest (detected: `actions/__tests__/professor-actions.test.ts` exists) |
| Config file        | Not yet detected — Wave 0 gap                                           |
| Quick run command  | `pnpm --filter frontend test --run`                                     |
| Full suite command | `pnpm --filter frontend test --run`                                     |

### Phase Requirements → Test Map

| Req ID | Behavior                                                      | Test Type | Automated Command                                                                   | File Exists? |
| ------ | ------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------- | ------------ |
| VIS-01 | `getPublications()` returns only `is_public = true` rows      | unit      | `pnpm --filter frontend test --run src/lib/queries/publications.test.ts`            | ❌ Wave 0    |
| VIS-01 | `getPatents()` returns only `is_public = true` rows           | unit      | `pnpm --filter frontend test --run src/lib/queries/publications.test.ts`            | ❌ Wave 0    |
| VIS-01 | `getProjects()` returns only `is_public = true` rows          | unit      | `pnpm --filter frontend test --run src/lib/queries/projects.test.ts`                | ❌ Wave 0    |
| VIS-01 | `getAllPublications()` returns all rows (no filter)           | unit      | same file                                                                           | ❌ Wave 0    |
| VIS-02 | `revalidateTag("publications")` called in `updatePublication` | unit      | `pnpm --filter frontend test --run src/actions/__tests__/professor-actions.test.ts` | ✅ (extend)  |
| VIS-02 | `revalidateTag("projects")` called in `updateProject`         | unit      | same file                                                                           | ✅ (extend)  |

### Sampling Rate

- **Per task commit:** `pnpm --filter frontend test --run`
- **Per wave merge:** `pnpm --filter frontend test --run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `frontend/src/lib/queries/publications.test.ts` — covers VIS-01 (mock Supabase client, verify `.eq("is_public", true)` called)
- [ ] `frontend/src/lib/queries/projects.test.ts` — covers VIS-01 for projects
- [ ] Vitest config file — check if `vitest.config.ts` exists; create if absent
- [ ] Extend `src/actions/__tests__/professor-actions.test.ts` to assert `revalidateTag` calls for VIS-02

## Sources

### Primary (HIGH confidence)

- Codebase read: `frontend/src/lib/queries/publications.ts` — confirmed no `is_public` filter, no `unstable_cache`
- Codebase read: `frontend/src/lib/queries/projects.ts` — same findings
- Codebase read: `frontend/src/actions/publications.ts` — confirmed `revalidatePath` only
- Codebase read: `frontend/src/actions/projects.ts` — confirmed `revalidatePath` only
- Codebase read: `frontend/src/app/(public)/[locale]/publications/page.tsx` — calls `getPublications()` directly
- Codebase read: `frontend/src/app/(public)/[locale]/projects/page.tsx` — `AccessDenied` gate + `getProjects()`
- Codebase read: `frontend/src/app/(public)/[locale]/patents/page.tsx` — `AccessDenied` gate + `getPatents()`
- `.planning/REQUIREMENTS.md` — VIS-01, VIS-02 definitions confirmed
- `.planning/STATE.md` — Phase 1 decisions, `projects` default `is_public=false` confirmed

### Secondary (MEDIUM confidence)

- Next.js `unstable_cache` + `revalidateTag` pattern: standard Next.js 14/15 documentation pattern for non-fetch data source caching

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — uses only existing Next.js built-ins already imported in the project
- Architecture: HIGH — derived directly from reading current codebase structure
- Pitfalls: HIGH — AccessDenied gate pitfall is directly observable in the source; revalidatePath/unstable_cache independence is Next.js documented behavior

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (stable Next.js APIs)
