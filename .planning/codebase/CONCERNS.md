# Codebase Concerns

**Analysis Date:** 2026-03-14

## Tech Debt

**Server Actions Have No Authorization Checks:**

- Issue: All server actions (`actions/publications.ts`, `actions/members.ts`, `actions/projects.ts`, `actions/news.ts`, `actions/profile.ts`, `actions/contact.ts`) rely entirely on middleware-level route protection. The actions themselves never verify that the calling user has a `professor` or `admin` role. Any authenticated session (even `member` role) can call these actions directly via fetch or curl.
- Files: `frontend/src/actions/publications.ts`, `frontend/src/actions/members.ts`, `frontend/src/actions/projects.ts`, `frontend/src/actions/news.ts`
- Impact: A `member`-role user can create, update, or delete publications, members, and projects by POSTing directly to the action endpoints.
- Fix approach: Add a role check at the top of each write action using `supabase.auth.getUser()` and a profile role lookup. Alternatively, enforce row-level security (RLS) policies in Supabase to restrict INSERT/UPDATE/DELETE to `professor`/`admin` roles.

**Join Table Updates Are Not Transactional:**

- Issue: In `updatePublication` and `updateProject` flows, the pattern is: update main row → delete join rows → re-insert join rows. These are three separate Supabase calls with no transaction. If the re-insert fails, the join rows are permanently deleted.
- Files: `frontend/src/actions/publications.ts` (lines 152–187), `frontend/src/actions/projects.ts`
- Impact: Data loss on partial failure — publication authors, research area links, or project member links may be silently wiped.
- Fix approach: Use a Supabase database function (RPC) that wraps the operations in a PostgreSQL transaction, or use Supabase's `upsert` approach that avoids the delete-then-insert pattern.

**Duplicate `generateSlug` Implementation:**

- Issue: `generateSlug` is implemented twice: once in `frontend/src/lib/utils/slug.ts` and once inline in `frontend/src/actions/members.ts` (lines 34–41). The two implementations may diverge over time.
- Files: `frontend/src/actions/members.ts` (line 34), `frontend/src/lib/utils/slug.ts`
- Impact: Slug generation inconsistency between members and other entities.
- Fix approach: Remove the inline copy in `actions/members.ts` and import from `lib/utils/slug.ts`.

**Static Data Files Coexist with Database Data:**

- Issue: `frontend/src/data/` directory contains `members.ts`, `publications.ts`, `projects.ts`, `patents.ts`, `news.ts`, `research-areas.ts`, `contact.ts`, `stats.ts` — hardcoded data files with real lab information. It is unclear which pages consume these versus the live Supabase queries in `lib/queries/`.
- Files: `frontend/src/data/members.ts`, `frontend/src/data/publications.ts`, `frontend/src/data/projects.ts`, `frontend/src/data/patents.ts`, `frontend/src/data/news.ts`
- Impact: Risk of stale/duplicate data being served to users if components accidentally import from `data/` instead of `lib/queries/`. Scholar URL in `data/members.ts` contains a `PLACEHOLDER` value.
- Fix approach: Audit all component imports. Migrate any remaining consumers of `data/` files to `lib/queries/`. Remove or archive `data/` files once migration is complete.

**`lib/permissions/` Directory Is Empty:**

- Issue: CLAUDE.md documents `lib/permissions/` as the location for server-side role checks, but no files exist there. Permission logic is currently split between `lib/db/middleware.ts` (middleware-level) and duplicated inline in each layout.
- Files: `frontend/src/lib/permissions/` (empty), `frontend/src/lib/db/middleware.ts`
- Impact: No centralized permission utility, making it easy to miss checks when adding new protected routes or actions.
- Fix approach: Create `lib/permissions/index.ts` with exported helpers such as `requireRole(supabase, ['professor', 'admin'])` and use them in both actions and layouts.

**i18n Migration Is Incomplete:**

- Issue: The public portal has been migrated to `[locale]` routing under `frontend/src/app/(public)/[locale]/`, but the middleware uses `localePrefix: "always"` which forces a prefix on all public URLs (e.g., `/ko/members`). Translation message files exist (`frontend/messages/ko.json`, `frontend/messages/en.json`) but it is not confirmed all public page strings are externalized.
- Files: `frontend/src/middleware.ts`, `frontend/src/i18n/config.ts`, `frontend/src/app/(public)/[locale]/`
- Impact: SEO impact from always-prefixed URLs; incomplete translations may cause missing strings in the English (`en`) locale.
- Fix approach: Audit `en.json` for completeness. Consider `localePrefix: "as-needed"` to serve the default Korean locale without a prefix.

**Demo/Prototype Pages Left in Production Routes:**

- Issue: `frontend/src/app/(public)/[locale]/canvas-demo/`, `canvas-demo2/`, `demos/` pages exist in the production route tree and are accessible to the public. These appear to be visual prototype pages (`NetworkBackgroundDemo.tsx` at 647 lines, `IsometricDemo.tsx` at 431 lines, `EcosystemDemo.tsx` at 346 lines).
- Files: `frontend/src/app/(public)/[locale]/canvas-demo/page.tsx`, `frontend/src/app/(public)/[locale]/canvas-demo2/page.tsx`, `frontend/src/app/(public)/[locale]/demos/page.tsx`, `frontend/src/components/home/NetworkBackgroundDemo.tsx`, `frontend/src/components/home/IsometricDemo.tsx`, `frontend/src/components/home/EcosystemDemo.tsx`
- Impact: Increases bundle size; exposes unfinished work publicly; large animation components may cause performance issues on lower-end devices.
- Fix approach: Delete the demo route pages and move demo components to a non-routed location, or remove entirely if no longer needed.

## Security Considerations

**No Input Validation in Server Actions:**

- Risk: Server actions accept raw `FormData` and cast fields directly to types (e.g., `formData.get("year") as string` then `Number(...)`). There is no validation library (Zod, Yup, etc.) enforcing length limits, format constraints, or required fields.
- Files: `frontend/src/actions/publications.ts`, `frontend/src/actions/members.ts`, `frontend/src/actions/projects.ts`
- Current mitigation: Database constraints in Supabase may catch some invalid values.
- Recommendations: Add Zod schema validation at the top of each action before any database write. Validate URL fields (doi, pdfUrl, links) to prevent unexpected values.

**Supabase URL Validation Bypass:**

- Risk: In `frontend/src/lib/db/middleware.ts` (line 8), if `NEXT_PUBLIC_SUPABASE_URL` is missing or malformed, the middleware returns `NextResponse.next()` — silently bypassing all auth checks.
- Files: `frontend/src/lib/db/middleware.ts` (lines 7–10)
- Current mitigation: Environment variables are expected to be set in deployment.
- Recommendations: Replace the silent bypass with an explicit error response or redirect to an error page when the Supabase URL is not configured.

**`<img>` Elements Bypass Next.js Image Optimization:**

- Risk: Multiple components use raw `<img>` tags with `eslint-disable-next-line @next/next/no-img-element` instead of `next/image`. This bypasses automatic image optimization, lazy loading, and format conversion.
- Files: `frontend/src/components/members/ProfessorProfile.tsx`, `frontend/src/components/home/HomeHeroSection.tsx`, `frontend/src/components/layout/SiteHeader.tsx`, `frontend/src/app/(public)/[locale]/canvas-demo2/page.tsx`
- Current mitigation: None.
- Recommendations: Replace `<img>` with `next/image` `<Image>` component where image dimensions are known.

## Performance Bottlenecks

**N+1 Query Pattern for Member Publications/Projects:**

- Problem: `getPublicationsByMember` in `lib/queries/publications.ts` (lines 144–164) and `getProjectsByMember` in `lib/queries/projects.ts` (lines 117–137) execute two sequential Supabase queries: first to get IDs, then to fetch full records. On member detail pages this compounds if called multiple times.
- Files: `frontend/src/lib/queries/publications.ts` (line 144), `frontend/src/lib/queries/projects.ts` (line 117)
- Cause: Junction table lookup separated from main record fetch.
- Improvement path: Rewrite as a single query using Supabase's nested select: `publications(*, publication_authors!inner(...))` filtered by `member_id`.

**`getPublications()` Fetches All Records Without Pagination:**

- Problem: `getPublications()` fetches every publication with full join data on each page load. As the publication list grows this becomes slow and wasteful.
- Files: `frontend/src/lib/queries/publications.ts` (line 50)
- Cause: No `.range()` or `.limit()` applied to the list query.
- Improvement path: Add server-side pagination with `.range(from, to)` and pass page parameters from the page component.

**Large Canvas/Animation Components in Bundle:**

- Problem: `NetworkBackgroundDemo.tsx` (647 lines), `NetworkBackground.tsx` (452 lines), `IsometricDemo.tsx` (431 lines), `EcosystemDemo.tsx` (346 lines) are heavy canvas-based animation components. If imported anywhere in the main bundle they inflate initial load.
- Files: `frontend/src/components/home/NetworkBackgroundDemo.tsx`, `frontend/src/components/home/NetworkBackground.tsx`, `frontend/src/components/home/IsometricDemo.tsx`, `frontend/src/components/home/EcosystemDemo.tsx`
- Improvement path: Use `next/dynamic` with `{ ssr: false }` for these components, or remove them if unused.

## Fragile Areas

**Middleware Auth Bypass on Supabase Misconfiguration:**

- Files: `frontend/src/lib/db/middleware.ts`
- Why fragile: The early-return on missing Supabase URL (line 8–10) means the entire auth gate silently passes in misconfigured environments. Any deploy without proper env vars will expose `/internal` and `/professor` routes.
- Safe modification: Always test middleware changes with a missing env var scenario.
- Test coverage: None.

**Slug Generation Collision Risk:**

- Files: `frontend/src/lib/utils/slug.ts`, `frontend/src/actions/members.ts`
- Why fragile: Slugs are generated from names/titles and inserted without a uniqueness check before the DB insert. If two publications or members share a similar name the insert will fail (or silently succeed with a duplicate slug if no DB unique constraint is set).
- Safe modification: Check for slug uniqueness or append a short UUID suffix before inserting.
- Test coverage: None.

## Test Coverage Gaps

**No Tests Exist:**

- What's not tested: The entire codebase has zero test files (no `.test.ts`, `.spec.ts`, `.test.tsx`, `.spec.tsx` files found).
- Files: All of `frontend/src/`
- Risk: Any refactor to queries, actions, permission logic, or slug generation could introduce regressions with no automated detection.
- Priority: High — especially for `lib/queries/`, `actions/`, and `lib/db/middleware.ts` which are security-critical.

## Missing Critical Features

**No RLS Policies Confirmed:**

- Problem: The Supabase migrations (`supabase/migrations/001_initial_schema.sql`, `002_seed_data.sql`, `003_add_is_international.sql`) may not include Row Level Security policies. Without RLS, the anon key can read and write all tables if server action auth is bypassed.
- Blocks: True defense-in-depth security at the database layer.

**No Error Boundaries on Public Pages:**

- Problem: Public page components like the locale-routed pages under `frontend/src/app/(public)/[locale]/` rely on a single `error.tsx` at the layout level. Component-level errors propagate up fully.
- Files: `frontend/src/app/(public)/[locale]/error.tsx`
- Blocks: Graceful degradation when a single section (e.g., featured publications) fails to load.

---

_Concerns audit: 2026-03-14_
