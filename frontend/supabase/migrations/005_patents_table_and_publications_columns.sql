-- ============================================================
-- SD Lab Homepage - Migration 005: Patents table + Publications columns
-- Created: 2026-03-16
-- Purpose: Separate patents from publications at the DB level.
--          Patents have different field structure (patent_number, status,
--          inventors) vs. publications. Also enriches publications with
--          index_type and volume_info for Phase 7 UI.
-- ============================================================

-- ============================================================
-- SECTION 1: Create patents table
-- ============================================================

CREATE TABLE IF NOT EXISTS patents (
  id           TEXT PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  title_en     TEXT,
  inventors    TEXT[] NOT NULL DEFAULT '{}',
  status       TEXT NOT NULL DEFAULT '등록',  -- '등록' or '출원'
  patent_number TEXT,
  date         DATE,
  note         TEXT,
  is_public    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patents_slug   ON patents (slug);
CREATE INDEX IF NOT EXISTS idx_patents_status ON patents (status);

-- Reuse the same updated_at trigger pattern as other tables
CREATE TRIGGER update_patents_updated_at
  BEFORE UPDATE ON patents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SECTION 2: RLS for patents table
-- ============================================================

ALTER TABLE patents ENABLE ROW LEVEL SECURITY;

-- Anon can read only is_public=true rows.
-- professor/admin (via is_admin_or_professor()) can read all rows.
CREATE POLICY "Public read patents" ON patents
  FOR SELECT USING (is_public = true OR is_admin_or_professor());

-- Only professor/admin can insert
CREATE POLICY "Admin insert patents" ON patents
  FOR INSERT WITH CHECK (is_admin_or_professor());

-- Only professor/admin can update
CREATE POLICY "Admin update patents" ON patents
  FOR UPDATE USING (is_admin_or_professor());

-- Only professor/admin can delete
CREATE POLICY "Admin delete patents" ON patents
  FOR DELETE USING (is_admin_or_professor());

-- ============================================================
-- SECTION 3: Add columns to publications
-- ============================================================

-- index_type: stores indexing classification (SCI/SCIE/SCOPUS/KCI/기타)
-- NULL means not yet categorized — no default value
ALTER TABLE publications ADD COLUMN IF NOT EXISTS index_type  TEXT;

-- volume_info: stores volume/issue/page range info (e.g. "Vol.12, No.3, pp.45-60")
-- NULL means not yet filled in — no default value
ALTER TABLE publications ADD COLUMN IF NOT EXISTS volume_info TEXT;

-- ============================================================
-- SECTION 4: Clean up patent data from publications
-- ============================================================

-- Remove all rows where type='patent' from the publications table.
-- These are now tracked in the patents table instead.
-- Per plan decision, patent data insertion into patents table is deferred to v2 (DATA-03).
DELETE FROM publications WHERE type = 'patent';

-- ============================================================
-- SECTION 5: Enum retention note
-- ============================================================

-- NOTE: 'patent' value remains in publication_type enum.
-- PostgreSQL does not support removing enum values (no DROP VALUE).
-- Application code will no longer use this value for publications.
-- The PublicationType TypeScript type will exclude 'patent'.
