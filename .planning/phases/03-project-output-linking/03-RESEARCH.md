# Phase 3: Project–Output Linking - Research

**Researched:** 2026-03-15
**Domain:** Next.js App Router cross-linking UI, Supabase join-table queries, Tailwind CSS mobile responsiveness
**Confidence:** HIGH

## Summary

Phase 3 adds bidirectional cross-linking between projects and their outputs (publications + patents). The data relationships already exist in the DB and are already fetched in both directions — `publication_projects` join table is already joined in both `projects.ts` and `publications.ts` queries. The `Project` type already carries `publicationIds`, and `Publication` type already carries `projectIds`.

The surprise finding is that **both detail pages already render related items inline** — the project detail page shows related publications as a list, and the publication/patent detail pages show related projects as cards. This means the core cross-linking UI is already implemented at the page level as inline JSX. Phase 3 is therefore primarily about: (1) extracting these inline sections into reusable components (`ProjectOutputsSection`, `ProjectBacklink`), (2) adding a dedicated `getProjectOutputs(projectId)` query function, and (3) fixing mobile layout issues on cards.

However, the project detail page has an access-control bug: it calls `if (!user) return <AccessDenied />` before rendering — meaning unauthenticated visitors cannot see project details at all. This conflicts with Phase 3's goal of showing linked outputs to visitors. This must be addressed as part of this phase.

**Primary recommendation:** Extract existing inline cross-link JSX into `ProjectOutputsSection` and `ProjectBacklink` components, add `getProjectOutputs` query, fix the AccessDenied gate on project detail, and apply `flex-col`/`w-full` mobile fixes to cards.

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                                                                        | Research Support                                                                                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LINK-01 | `getProjectOutputs(projectId)` query function — returns publications + patents linked to a project via `publication_projects` join | Join table and query patterns already established in `projects.ts`/`publications.ts`; add dedicated function to `lib/queries/projects.ts`                         |
| LINK-02 | `ProjectOutputsSection` component on project detail page showing linked publication/patent cards                                   | Inline section already exists in `projects/[slug]/page.tsx` lines 268-292; extract into component in `components/projects/`                                       |
| LINK-03 | `ProjectBacklink` component on publication/patent detail pages showing linked project with navigation                              | Inline section already exists in both `publications/[slug]/page.tsx` (lines 241-282) and `patents/[slug]/page.tsx` (lines 185-226); extract into shared component |
| MOB-01  | PublicationCard, PatentCard, ProjectCard mobile layout at 375px — no horizontal overflow                                           | Cards use `flex` layout; need `w-full min-w-0` guards and `break-words` on long text                                                                              |
| MOB-02  | Project detail page outputs section mobile responsiveness                                                                          | Section uses `flex flex-col gap-3` — safe; card content needs `min-w-0` to prevent overflow                                                                       |

</phase_requirements>

## Standard Stack

### Core

| Library            | Version           | Purpose                                             | Why Standard                                                |
| ------------------ | ----------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| Next.js App Router | 16 (project)      | Server Components for data fetching in detail pages | Already in use throughout                                   |
| Supabase JS        | 2.x (project)     | `publication_projects` join table queries           | Already used in all query files                             |
| next-intl          | current (project) | Translation keys for new section headings           | Already used in detail pages                                |
| Tailwind CSS       | v4 (project)      | Mobile-responsive utility classes                   | Already used throughout                                     |
| vitest             | current (project) | Unit tests for new query function                   | Already used in `projects.test.ts` / `publications.test.ts` |

### Supporting

| Library                    | Version  | Purpose                                                             | When to Use                   |
| -------------------------- | -------- | ------------------------------------------------------------------- | ----------------------------- |
| `unstable_cache` (Next.js) | built-in | Cache `getProjectOutputs` with `tags: ["projects", "publications"]` | Any new public query function |

**Installation:** No new packages required.

## Architecture Patterns

### Recommended Project Structure (additions only)

```
frontend/src/
  lib/queries/
    projects.ts              # Add getProjectOutputs(projectId)
  components/projects/
    ProjectOutputsSection.tsx  # NEW — extracted from project detail page
  components/shared/
    ProjectBacklink.tsx        # NEW — extracted from pub/patent detail pages
  app/(public)/[locale]/
    projects/[slug]/page.tsx   # Remove AccessDenied gate, add ProjectOutputsSection
    publications/[slug]/page.tsx  # Replace inline related-projects with ProjectBacklink
    patents/[slug]/page.tsx       # Replace inline related-projects with ProjectBacklink
```

### Pattern 1: getProjectOutputs Query

**What:** Fetches publications and patents linked to a project using `publication_projects` join, filtered by `is_public = true`.
**When to use:** Called from project detail Server Component.
**Example:**

```typescript
// Source: modeled on existing getPublicationsByMember in lib/queries/publications.ts
export const getProjectOutputs = unstable_cache(
  async (projectId: string): Promise<Publication[]> => {
    const supabase = await createClient();
    const { data: joinRows } = await supabase
      .from("publication_projects")
      .select("publication_id")
      .eq("project_id", projectId);

    if (!joinRows?.length) return [];

    const pubIds = joinRows.map((r) => r.publication_id);
    const { data, error } = await supabase
      .from("publications")
      .select(PUB_SELECT)
      .eq("is_public", true)
      .in("id", pubIds)
      .order("year", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toPublication);
  },
  ["project-outputs"],
  { tags: ["projects", "publications"] },
);
```

Note: `PUB_SELECT` and `toPublication` live in `publications.ts` — either move them to a shared location or implement the query inline in `projects.ts` using the same shape.

### Pattern 2: ProjectOutputsSection Component

**What:** Server Component (no `"use client"`) that renders publications and patents in two groups.
**When to use:** Placed inside project detail page after the members section.

```typescript
// Source: extracted from app/(public)/[locale]/projects/[slug]/page.tsx lines 268-292
// Separates publications (type !== 'patent') from patents (type === 'patent')
type Props = { outputs: Publication[]; t: ... };

export function ProjectOutputsSection({ outputs, t }: Props) {
  const publications = outputs.filter((o) => o.type !== "patent");
  const patents = outputs.filter((o) => o.type === "patent");
  // renders two sub-sections with card links to /publications/[slug] and /patents/[slug]
}
```

### Pattern 3: ProjectBacklink Component

**What:** Simple Server Component rendering a "연계 과제" section with one or more project links.
**When to use:** Bottom of publication and patent detail pages.

```typescript
// Source: extracted from app/(public)/[locale]/publications/[slug]/page.tsx lines 241-282
// Same JSX already in patents/[slug]/page.tsx lines 185-226
type Props = { projects: Project[] };

export function ProjectBacklink({ projects }: Props) {
  if (!projects.length) return null;
  return (
    <section>
      <h2>연계 과제</h2>
      {projects.map((proj) => (
        <Link key={proj.id} href={`/projects/${proj.slug}`}>
          ...
        </Link>
      ))}
    </section>
  );
}
```

### Pattern 4: Remove AccessDenied Gate from Project Detail

**What:** `projects/[slug]/page.tsx` line 32 currently returns `<AccessDenied />` for unauthenticated users. This must be removed for public visitor access.
**Why it exists:** Projects were previously access-controlled (noted in project MEMORY: "Projects/Patents 비공개 처리 이유 및 향후 정리 계획"). Phase 3 makes them publicly accessible for projects with `is_public = true`.
**Resolution:** Remove the `getSession()` / `if (!user)` guard. RLS already protects `is_public = false` rows at the DB level (DB-02, Phase 1).

### Anti-Patterns to Avoid

- **Fetching full publication list then filtering in-page:** Already done on project detail page (`getPublications()` → `.filter()`). Replace with `getProjectOutputs(project.id)` for a targeted query.
- **Duplicating ProjectBacklink JSX:** Currently duplicated identically in publications and patents detail pages. Extract once into `components/shared/ProjectBacklink.tsx`.
- **`interface` keyword:** Use `type` per project conventions.
- **`enum` for publication types:** Use string literal union — `Publication["type"]` already defined correctly.

## Don't Hand-Roll

| Problem                        | Don't Build          | Use Instead                                                            | Why                                             |
| ------------------------------ | -------------------- | ---------------------------------------------------------------------- | ----------------------------------------------- |
| Join table traversal           | Custom SQL string    | Supabase `.in()` chained query (see `getPublicationsByMember` pattern) | Already tested pattern in codebase              |
| Cache invalidation for outputs | Manual cache busting | `unstable_cache` with `tags: ["projects", "publications"]`             | Both tags invalidated by existing write actions |
| Mobile overflow prevention     | Custom CSS           | Tailwind `min-w-0 w-full overflow-hidden break-words`                  | Sufficient for all card text overflow cases     |

**Key insight:** All data relationships already exist and are already joined — this phase is primarily component extraction and access control fix, not new data engineering.

## Common Pitfalls

### Pitfall 1: PUB_SELECT / toPublication Not Exported

**What goes wrong:** `getProjectOutputs` needs the same `PUB_SELECT` select string and `toPublication` mapper from `publications.ts`, but they are not exported.
**Why it happens:** Query internals are module-private by convention.
**How to avoid:** Either (a) implement `getProjectOutputs` in `publications.ts` where `PUB_SELECT`/`toPublication` are accessible, or (b) move shared types/mappers to `lib/queries/shared.ts`.
**Warning signs:** TypeScript error "not exported" or duplicated select strings drifting out of sync.

### Pitfall 2: Project Detail Filters by publicationIds Already in Project Object

**What goes wrong:** Current project detail page uses `project.publicationIds` (already fetched via `publication_projects` join in `getProjectBySlug`) to filter the full publication list. This works but fetches ALL publications unnecessarily.
**How to avoid:** `getProjectOutputs(project.id)` replaces `getPublications().filter(...)` — smaller payload, clearer intent.

### Pitfall 3: unstable_cache Key Collision with Dynamic Parameter

**What goes wrong:** `getProjectBySlug` uses cache key `["project-slug"]` (no slug in key array) — this is a known pattern in the codebase for single-arg cached functions. `getProjectOutputs` must include `projectId` in the cache key array.
**How to avoid:**

```typescript
// CORRECT — include parameter in key
unstable_cache(fn, ["project-outputs", projectId], { tags: ["projects", "publications"] })
// WRONG — omits parameter, all projects share same cache entry
unstable_cache(fn, ["project-outputs"], ...)
```

### Pitfall 4: Mobile Overflow in Cards with Long Korean Text

**What goes wrong:** Korean publication titles and patent titles can be very long. Without `min-w-0` on flex children, text pushes card width beyond 375px viewport.
**How to avoid:** Add `min-w-0` to the text container div inside each card, and `break-words` (or `word-break: break-word` via `break-words` Tailwind class) on title text.
**Warning signs:** Horizontal scrollbar appears at 375px in browser DevTools.

### Pitfall 5: Patent Detail Page Has Hardcoded Korean Strings

**What goes wrong:** `patents/[slug]/page.tsx` uses hardcoded `"관련 프로젝트"` and `"연구 분야"` instead of translation keys (unlike publications page which uses `t("sectionRelatedProjects")`).
**How to avoid:** When extracting `ProjectBacklink`, use the `t` function and ensure translation keys exist in `ko.json` and `en.json`.

## Code Examples

### Existing mock chain pattern for new query tests

```typescript
// Source: frontend/src/lib/queries/projects.test.ts lines 1-34
// Pattern to follow for getProjectOutputs test
const mockChain = vi.hoisted(() => {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {
    from: vi.fn(),
    select: vi.fn(),
    eq: vi.fn(),
    in: vi.fn(),
    order: vi.fn(),
  };
  chain.from.mockReturnValue(chain);
  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.in.mockReturnValue(chain);
  chain.order.mockReturnValue(
    Object.assign(Promise.resolve({ data: [], error: null }), chain),
  );
  return chain;
});
```

### Existing mobile-safe card pattern to replicate

```typescript
// Source: ProjectCard.tsx — uses flex-col h-full with flex-1 on description
// For overflow: add min-w-0 to text containers, break-words on titles
<div className="min-w-0 flex-1">
  <p className="text-sm font-medium text-foreground leading-snug break-words">
    {title}
  </p>
</div>
```

## State of the Art

| Old Approach                                      | Current Approach                                                    | Impact                              |
| ------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------- |
| Inline related-items JSX in page files            | Extract into `ProjectOutputsSection` / `ProjectBacklink` components | DRY, testable, consistent           |
| Fetch all publications then filter client-side    | `getProjectOutputs(id)` targeted query                              | Smaller payload, intent-clear       |
| Access-controlled project detail (login required) | Public detail for `is_public = true` projects                       | Visitors can browse project outputs |

**Deprecated/outdated:**

- `getSession()` guard on project detail page: remove in this phase (projects are now public per Phase 1/2 `is_public` infrastructure).

## Open Questions

1. **Where to place `getProjectOutputs`?**
   - What we know: Needs `PUB_SELECT` + `toPublication` from `publications.ts`
   - What's unclear: Whether to put it in `projects.ts` (with duplicated helpers) or `publications.ts` (logical home for publication queries)
   - Recommendation: Place in `publications.ts` alongside `getPublicationsByMember` — same pattern, same helpers available.

2. **Should `ProjectOutputsSection` split publications from patents?**
   - What we know: Publications (type != 'patent') link to `/publications/[slug]`, patents link to `/patents/[slug]`
   - What's unclear: Whether one combined "결과물" section or two separate sections is preferred
   - Recommendation: Two sub-sections ("관련 논문" + "관련 특허") matching existing page heading style, each conditionally rendered.

## Validation Architecture

### Test Framework

| Property           | Value                                                           |
| ------------------ | --------------------------------------------------------------- |
| Framework          | vitest (project-configured)                                     |
| Config file        | `frontend/vitest.config.ts` (inferred from existing test files) |
| Quick run command  | `cd frontend && pnpm vitest run src/lib/queries/`               |
| Full suite command | `cd frontend && pnpm vitest run`                                |

### Phase Requirements → Test Map

| Req ID  | Behavior                                                                       | Test Type     | Automated Command                                                     | File Exists? |
| ------- | ------------------------------------------------------------------------------ | ------------- | --------------------------------------------------------------------- | ------------ |
| LINK-01 | `getProjectOutputs(id)` calls `.eq('is_public', true)` and `.in('id', pubIds)` | unit          | `cd frontend && pnpm vitest run src/lib/queries/publications.test.ts` | ❌ Wave 0    |
| LINK-02 | `ProjectOutputsSection` renders publication and patent cards                   | unit/smoke    | manual visual check at 375px                                          | ❌ Wave 0    |
| LINK-03 | `ProjectBacklink` renders project link with correct href                       | unit          | manual visual check                                                   | ❌ Wave 0    |
| MOB-01  | Cards render without horizontal overflow at 375px                              | visual/manual | DevTools 375px viewport check                                         | manual-only  |
| MOB-02  | Project outputs section renders without overflow at 375px                      | visual/manual | DevTools 375px viewport check                                         | manual-only  |

### Sampling Rate

- **Per task commit:** `cd frontend && pnpm vitest run src/lib/queries/`
- **Per wave merge:** `cd frontend && pnpm vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `frontend/src/lib/queries/publications.test.ts` — extend with LINK-01 tests for `getProjectOutputs`
- [ ] No new test file needed for components (visual-only for MOB-01/MOB-02)

## Sources

### Primary (HIGH confidence)

- Direct codebase read — `frontend/src/lib/queries/projects.ts` — confirms join table already fetched
- Direct codebase read — `frontend/src/lib/queries/publications.ts` — confirms `publication_projects` join and `projectIds` mapped
- Direct codebase read — `frontend/src/app/(public)/[locale]/projects/[slug]/page.tsx` — confirms inline related publications section already exists AND AccessDenied gate issue
- Direct codebase read — `frontend/src/app/(public)/[locale]/publications/[slug]/page.tsx` — confirms inline related projects section exists
- Direct codebase read — `frontend/src/app/(public)/[locale]/patents/[slug]/page.tsx` — confirms identical inline related projects section + hardcoded strings issue
- Direct codebase read — `frontend/src/types/publication.ts` — confirms `projectIds: string[]` on Publication type

### Secondary (MEDIUM confidence)

- `.planning/REQUIREMENTS.md` — phase requirement definitions
- `.planning/ROADMAP.md` — phase goals and success criteria
- `MEMORY.md` — project note about Projects/Patents access control history

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all libraries already in use, no new dependencies
- Architecture: HIGH — patterns directly observed in codebase
- Pitfalls: HIGH — AccessDenied gate and cache key issues found by direct code inspection
- Mobile patterns: MEDIUM — Tailwind overflow fixes standard but not yet verified against actual card rendering

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (stable stack, no fast-moving dependencies)
