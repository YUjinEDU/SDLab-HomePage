---
phase: 05-db-schema
verified: 2026-03-16T00:00:00Z
status: passed
score: 4/4 must-haves verified
re_verification: false
---

# Phase 5: DB Schema Verification Report

**Phase Goal:** patents가 별도 테이블로 분리되고, publications 테이블이 인덱스·수록정보 컬럼을 갖춘다
**Verified:** 2026-03-16
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                               | Status   | Evidence                                                                                                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | patents 테이블이 독립적으로 존재하고 id, title, inventors[], status, patent_number, date, is_public 컬럼을 포함한다 | VERIFIED | `005_patents_table_and_publications_columns.sql` lines 14-27: `CREATE TABLE IF NOT EXISTS patents` with all required columns including `inventors TEXT[]`, `status TEXT`, `patent_number TEXT`, `date DATE`, `is_public BOOLEAN` |
| 2   | publications 테이블에 index_type 컬럼이 존재하여 SCI/SCIE/SCOPUS/KCI/기타 값을 저장할 수 있다                       | VERIFIED | Migration line 67: `ALTER TABLE publications ADD COLUMN IF NOT EXISTS index_type TEXT`; query mapper line 43: `indexType: (row.index_type as string) ?? null`                                                                    |
| 3   | publications 테이블에 volume_info 컬럼이 존재하여 권호 페이지 정보를 저장할 수 있다                                 | VERIFIED | Migration line 71: `ALTER TABLE publications ADD COLUMN IF NOT EXISTS volume_info TEXT`; query mapper line 44: `volumeInfo: (row.volume_info as string) ?? null`                                                                 |
| 4   | 기존 publications 테이블의 type='patent' 데이터가 제거되어 논문 데이터만 남는다                                     | VERIFIED | Migration line 80: `DELETE FROM publications WHERE type = 'patent'`; `PublicationType` union no longer includes `"patent"`; `.neq("type","patent")` filters absent from query functions                                          |

**Score:** 4/4 truths verified

### Required Artifacts

| Artifact                                                                      | Expected                                                                            | Status   | Details                                                                                                                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/supabase/migrations/005_patents_table_and_publications_columns.sql` | Patents table DDL, publications column additions, patent data cleanup, RLS policies | VERIFIED | All 5 sections present: CREATE TABLE patents, RLS (4 policies), ALTER TABLE publications (2 columns), DELETE cleanup, enum retention note |
| `frontend/src/types/patent.ts`                                                | Patent TypeScript type definition                                                   | VERIFIED | Exports `PatentStatus = "등록" \| "출원"` and `Patent` type with all required fields                                                      |
| `frontend/src/types/publication.ts`                                           | Updated Publication type with indexType and volumeInfo fields                       | VERIFIED | `indexType: string \| null` and `volumeInfo: string \| null` present; `"patent"` removed from `PublicationType` union                     |
| `frontend/src/lib/queries/publications.ts`                                    | Updated query functions without patent-related queries                              | VERIFIED | `toPublication` maps `index_type`/`volume_info`; patent queries stubbed with Phase 8 TODO; no `.neq("type","patent")` filters             |

### Key Link Verification

| From                                       | To                            | Via                                      | Status | Details                                                                                    |
| ------------------------------------------ | ----------------------------- | ---------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| `frontend/src/types/patent.ts`             | `frontend/src/types/index.ts` | re-export                                | WIRED  | Line 6: `export type { PatentStatus, Patent } from "./patent"`                             |
| `frontend/src/lib/queries/publications.ts` | publications table            | toPublication mapper includes new fields | WIRED  | Lines 43-44: `indexType` and `volumeInfo` mapped from `row.index_type` / `row.volume_info` |

### Requirements Coverage

| Requirement | Source Plan   | Description                                                                                               | Status    | Evidence                                                                                                             |
| ----------- | ------------- | --------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------- |
| SCHEMA-01   | 05-01-PLAN.md | patents 별도 테이블 생성 (id, title, title_en, inventors[], status, patent_number, date, note, is_public) | SATISFIED | Migration 005 Section 1 creates `patents` table with all listed columns                                              |
| SCHEMA-02   | 05-01-PLAN.md | publications에 index_type TEXT 컬럼 추가 (SCI/SCIE/SCOPUS/KCI/기타)                                       | SATISFIED | Migration 005 Section 3: `ALTER TABLE publications ADD COLUMN IF NOT EXISTS index_type TEXT`                         |
| SCHEMA-03   | 05-01-PLAN.md | publications에 volume_info TEXT 컬럼 추가 (권호·페이지 정보)                                              | SATISFIED | Migration 005 Section 3: `ALTER TABLE publications ADD COLUMN IF NOT EXISTS volume_info TEXT`                        |
| SCHEMA-04   | 05-01-PLAN.md | 기존 publications에서 type='patent' 데이터 정리/제거                                                      | SATISFIED | Migration 005 Section 4: `DELETE FROM publications WHERE type = 'patent'`; TypeScript type union updated accordingly |

### Anti-Patterns Found

| File                                       | Line    | Pattern                                           | Severity | Impact                                                                          |
| ------------------------------------------ | ------- | ------------------------------------------------- | -------- | ------------------------------------------------------------------------------- |
| `frontend/src/lib/queries/publications.ts` | 110-113 | `getPatents`/`getPatentBySlug` return empty stubs | Info     | Intentional — Phase 8 TODO stubs to prevent runtime breakage; clearly commented |

No blockers or warnings. The stubs are intentional and documented per the plan's decision.

### Human Verification Required

#### 1. Migration Execution Against Supabase

**Test:** Run `005_patents_table_and_publications_columns.sql` against the actual Supabase instance
**Expected:** `patents` table appears in Supabase dashboard; `publications` gains `index_type` and `volume_info` columns; any `type='patent'` rows are deleted
**Why human:** Cannot verify against the live DB from static analysis — migration file is syntactically complete but actual execution must be confirmed

### Gaps Summary

No gaps. All 4 truths verified, all artifacts exist and are substantive, all key links are wired. Requirements SCHEMA-01 through SCHEMA-04 are all satisfied by Migration 005 and the updated TypeScript layer.

The only pending item is human execution of the migration against the live Supabase instance — this is expected per the plan's "schema-ready-to-run" success criteria.

---

_Verified: 2026-03-16_
_Verifier: Claude (gsd-verifier)_
