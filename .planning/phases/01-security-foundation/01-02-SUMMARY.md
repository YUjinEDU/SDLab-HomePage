---
phase: 01-security-foundation
plan: 02
subsystem: database
tags: [supabase, postgres, rls, row-level-security, migration, rpc]

# Dependency graph
requires: []
provides:
  - "publications.is_public column (BOOLEAN NOT NULL DEFAULT true)"
  - "projects.is_public column (BOOLEAN NOT NULL DEFAULT false)"
  - "RLS SELECT policies on publications/projects enforcing is_public at DB layer"
  - "update_publication_with_relations SECURITY DEFINER RPC function"
affects: [professor-portal, public-portal, api-routes]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "is_public column + RLS USING clause for DB-level visibility enforcement"
    - "SECURITY DEFINER RPC for atomic multi-table writes"
    - "DELETE + INSERT pattern for join table replacement within single transaction"

key-files:
  created:
    - frontend/supabase/migrations/004_add_is_public.sql
  modified: []

key-decisions:
  - "publications default is_public = true (all existing papers/patents are public)"
  - "projects default is_public = false (private by default per user decision)"
  - "RPC signature aligned to actual schema: venue field, not journal/volume/issue/pages"
  - "author_order preserved in publication_authors using generate_subscripts()"

patterns-established:
  - "RLS enforcement: USING (is_public = true OR is_admin_or_professor()) — reuse is_admin_or_professor() helper"
  - "Atomic join-table replacement: DELETE WHERE publication_id = p_id, then INSERT SELECT unnest()"

requirements-completed: [DB-01, DB-02, DB-03]

# Metrics
duration: 15min
completed: 2026-03-15
---

# Phase 1 Plan 02: is_public Migration Summary

**PostgreSQL migration adding is_public columns to publications/projects, replacing USING(true) RLS policies with visibility-aware enforcement, and creating an atomic update_publication_with_relations RPC.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-14T23:53:21Z
- **Completed:** 2026-03-15T00:08:00Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments

- Added `is_public BOOLEAN NOT NULL` to publications (default true) and projects (default false)
- Replaced unconditional `USING(true)` SELECT policies with `USING (is_public = true OR is_admin_or_professor())` — anon REST API can no longer retrieve private rows
- Created `update_publication_with_relations` SECURITY DEFINER function that atomically updates publication row + all three join tables (publication_authors, publication_research_areas, publication_projects)
- Dry-run via `npx supabase db push --dry-run` confirmed migration parses without errors

## Task Commits

1. **Task 1: Write Migration 004** - `25eae1e` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `frontend/supabase/migrations/004_add_is_public.sql` — All four sections: ALTER TABLE, backfill UPDATE, DROP/CREATE RLS policies, CREATE FUNCTION RPC

## Decisions Made

- **publications default true**: All existing lab papers and patents are intended to be public-facing — safe default.
- **projects default false**: User previously decided projects should be private by default (see `.bkit/state/memory.json` reference).
- **RPC signature uses `venue`**: The actual `publications` schema has a `venue` column (not `journal`/`volume`/`issue`/`pages` as the plan template suggested). Aligned the RPC to the real schema to prevent runtime errors.
- **author_order preserved**: Used `generate_subscripts(p_author_ids, 1) - 1` to maintain insertion order as author_order in publication_authors, since the join table has an `author_order` column.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] RPC signature aligned to actual publications schema**

- **Found during:** Task 1 (writing migration)
- **Issue:** Plan specified `p_journal TEXT, p_volume TEXT, p_issue TEXT, p_pages TEXT` but publications table has `venue TEXT` with no volume/issue/pages columns. Using the plan's signature would produce a runtime error.
- **Fix:** Changed RPC parameters to `p_venue TEXT` and added the actual columns that exist: `p_month INT, p_doi TEXT, p_pdf_url TEXT, p_keywords TEXT[], p_bibtex TEXT, p_is_featured BOOLEAN, p_is_public BOOLEAN`
- **Files modified:** `frontend/supabase/migrations/004_add_is_public.sql`
- **Verification:** Dry-run passed without errors
- **Committed in:** `25eae1e` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — schema mismatch bug)
**Impact on plan:** Required correction — plan template used placeholder column names. Fix aligns RPC to real schema. No scope creep.

## Issues Encountered

None beyond the schema mismatch deviation above.

## User Setup Required

Migration must be applied to the live Supabase project:

```bash
cd frontend && npx supabase db push
```

Post-apply verification:

1. `curl -H "apikey: <anon-key>" https://<project>.supabase.co/rest/v1/publications?is_public=eq.false` — expect 0 rows
2. `curl -H "apikey: <anon-key>" https://<project>.supabase.co/rest/v1/projects?is_public=eq.false` — expect 0 rows
3. Professor-role query must return all rows including is_public=false

## Next Phase Readiness

- DB-layer visibility enforcement in place — app layer can now trust that anon queries are already filtered
- `update_publication_with_relations` RPC ready for use in professor portal publication edit actions
- Plans 01-03 and 01-04 can proceed (middleware/permissions layer, app-layer guards)

---

_Phase: 01-security-foundation_
_Completed: 2026-03-15_
