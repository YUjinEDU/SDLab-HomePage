---
phase: 05-db-schema
plan: 01
subsystem: database-schema
tags: [migration, patents, publications, typescript-types, schema-split]
completed: "2026-03-16"
duration_minutes: 35

dependency_graph:
  requires: []
  provides:
    [
      patents-table-ddl,
      publication-index-type,
      publication-volume-info,
      patent-typescript-type,
    ]
  affects: [phase-07-ui, phase-08-patent-ui]

tech_stack:
  added: []
  patterns:
    - SQL migration with 5-section structure (DDL, RLS, columns, cleanup, notes)
    - TypeScript type split: Patent separate from Publication
    - Phase stub pattern for deferred features (Phase 8 TODO stubs)

key_files:
  created:
    - frontend/supabase/migrations/005_patents_table_and_publications_columns.sql
    - frontend/src/types/patent.ts
  modified:
    - frontend/src/types/publication.ts
    - frontend/src/types/index.ts
    - frontend/src/lib/queries/publications.ts
    - frontend/src/data/patents.ts
    - frontend/src/data/publications.ts
    - frontend/src/components/patents/PatentCard.tsx
    - frontend/src/components/projects/ProjectOutputsSection.tsx
    - frontend/src/app/(public)/[locale]/patents/PatentsPageClient.tsx
    - frontend/src/app/(public)/[locale]/patents/[slug]/page.tsx
    - frontend/src/app/(professor)/professor/patents/page.tsx
    - frontend/src/app/(professor)/professor/patents/new/page.tsx
    - frontend/src/app/(professor)/professor/patents/[id]/edit/page.tsx
    - frontend/src/app/(professor)/professor/publications/PublicationForm.tsx
    - frontend/src/app/(public)/[locale]/members/[slug]/page.tsx

key_decisions:
  - "Patent type separated from Publication type — different field structure (inventors/status/patentNumber/date vs authors/venue/year)"
  - "getPatents/getPatentBySlug stubbed to return Patent[] empty arrays — Phase 8 will query patents table"
  - "Professor patent management pages stubbed with amber notice — Phase 8 will rebuild"
  - "publications.test.ts tuple destructuring TS errors are pre-existing, not caused by this plan — deferred"

metrics:
  tasks_completed: 3
  tasks_total: 3
  files_created: 2
  files_modified: 13
  commits: 2
---

# Phase 5 Plan 01: DB Schema — Patents Table and Publications Columns Summary

**One-liner:** SQL migration separating patents into dedicated table with RLS, adding index_type/volume_info to publications, and updating TypeScript types and query layer to match.

## What Was Built

**Migration 005** creates a `patents` table (id, slug, title, inventors[], status, patent_number, date, is_public) with full RLS matching existing patterns, adds nullable `index_type` and `volume_info` columns to `publications`, deletes any `type='patent'` rows from publications, and documents the enum retention constraint.

**TypeScript types** now have a standalone `Patent` type (PatentStatus = '등록' | '출원') separate from `Publication`. The `PublicationType` union no longer includes `"patent"`. `Publication` gains `indexType: string | null` and `volumeInfo: string | null`.

**Query layer** removes `.neq("type","patent")` filters (no longer needed after data cleanup), adds field mappings for new columns in `toPublication`, and stubs `getPatents`/`getPatentBySlug` to return `Patent[]` empty arrays pending Phase 8.

## Tasks Completed

| Task | Name                                      | Commit  | Files                                                 |
| ---- | ----------------------------------------- | ------- | ----------------------------------------------------- |
| 1    | Migration 005 SQL                         | 52d66f4 | supabase/migrations/005\_\*.sql                       |
| 2    | Patent type + Publication type update     | b27a498 | types/patent.ts, types/publication.ts, types/index.ts |
| 3    | Query functions update + downstream fixes | b27a498 | queries/publications.ts + 10 affected files           |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] PatentCard used Publication fields not present on Patent type**

- Found during: Task 3 (tsc verification)
- Issue: PatentCard destructured `authors`, `venue`, `year`, `month`, `doi`, `keywords` from `Publication` — all invalid on new `Patent` type
- Fix: Rewrote PatentCard to use `inventors`, `status`, `patentNumber`, `date` from `Patent`; replaced keyword tags with date calendar icon
- Files modified: `frontend/src/components/patents/PatentCard.tsx`
- Commit: b27a498

**2. [Rule 1 - Bug] PatentsPageClient filtered/searched using Publication fields**

- Found during: Task 3
- Issue: Used `p.year`, `p.authors`, `p.keywords` — absent on `Patent`
- Fix: Added `getPatentYear()` helper parsing `date` field; updated filter to use `inventors` + `titleEn`
- Files modified: `frontend/src/app/(public)/[locale]/patents/PatentsPageClient.tsx`
- Commit: b27a498

**3. [Rule 1 - Bug] Patent detail page used Publication fields**

- Found during: Task 3
- Issue: Used `patent.abstract`, `patent.authors`, `patent.venue`, `patent.keywords`, `patent.projectIds`, `patent.researchAreaIds`
- Fix: Updated to use `patent.inventors`, `patent.note`, `patent.patentNumber`, `patent.date`; removed related projects/areas sections (data not on Patent type)
- Files modified: `frontend/src/app/(public)/[locale]/patents/[slug]/page.tsx`
- Commit: b27a498

**4. [Rule 1 - Bug] data/patents.ts used Publication type with type="patent"**

- Found during: Task 3 (tsc)
- Fix: Converted to new `Patent` type with correct fields
- Files modified: `frontend/src/data/patents.ts`

**5. [Rule 2 - Missing] data/publications.ts missing indexType/volumeInfo**

- Found during: Task 3 (tsc)
- Fix: Added `indexType: null, volumeInfo: null` to all 5 static publication fixtures
- Files modified: `frontend/src/data/publications.ts`

**6. [Rule 1 - Bug] ProjectOutputsSection filtered by `type === "patent"`**

- Found during: Task 3 (tsc)
- Fix: Removed patent split; all outputs render as publications with Phase 8 TODO comment
- Files modified: `frontend/src/components/projects/ProjectOutputsSection.tsx`

**7. [Rule 1 - Bug] member/[slug]/page.tsx filtered publications by patent type**

- Found during: Task 3 (tsc)
- Fix: Removed patent filter; memberPatents set to empty array with Phase 8 TODO
- Files modified: `frontend/src/app/(public)/[locale]/members/[slug]/page.tsx`

**8. [Rule 1 - Bug] professor/patents pages used Publication-based patent queries**

- Found during: Task 3 (tsc)
- Fix: Replaced all 3 pages (list, new, edit) with Phase 8 stub notices; removed broken query imports
- Files modified: professor/patents/{page,new/page,[id]/edit/page}.tsx

**9. [Rule 1 - Bug] PublicationForm had "patent" as selectable type**

- Found during: Task 3 (tsc)
- Fix: Removed "patent" from PUBLICATION_TYPES array with explanatory comment
- Files modified: `PublicationForm.tsx`

### Deferred Items

- `publications.test.ts` lines 123, 142, 163: Pre-existing `.mock.calls` tuple destructuring TypeScript errors (not introduced by this plan). Logged to deferred-items.md.

## Self-Check: PASSED

Files verified:

- `frontend/supabase/migrations/005_patents_table_and_publications_columns.sql` — EXISTS
- `frontend/src/types/patent.ts` — EXISTS, contains `export type Patent`
- `frontend/src/types/publication.ts` — contains `indexType`, does NOT contain `"patent"` in union
- `frontend/src/lib/queries/publications.ts` — contains `indexType`, `volumeInfo` in mapper; no `.neq("type","patent")`
- Commits 52d66f4 and b27a498 — EXIST in git log
- `npx tsc --noEmit` — 0 errors in non-test source files
