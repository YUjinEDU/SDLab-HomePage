-- ============================================================
-- SD Lab Homepage - Migration 004: is_public columns + RLS + RPC
-- Created: 2026-03-15
-- Purpose: DB-level enforcement of public/private content visibility.
--          App-layer filters alone are bypassable via direct Supabase REST.
-- ============================================================

-- ============================================================
-- SECTION 1: Add is_public columns
-- ============================================================

-- publications default true (all existing papers/patents are public)
ALTER TABLE publications ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;

-- projects default false (per user decision: projects are private by default)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;

-- ============================================================
-- SECTION 2: Backfill existing rows to match locked decisions
-- ============================================================

UPDATE publications SET is_public = true  WHERE is_public IS DISTINCT FROM true;
UPDATE projects     SET is_public = false WHERE is_public IS DISTINCT FROM false;

-- ============================================================
-- SECTION 3: Replace unconditional USING(true) read policies
-- ============================================================

DROP POLICY IF EXISTS "Public read publications" ON publications;
DROP POLICY IF EXISTS "Public read projects"     ON projects;

-- Anon can read only is_public=true rows.
-- professor/admin (via is_admin_or_professor()) can read all rows.
CREATE POLICY "Public read publications" ON publications
  FOR SELECT USING (is_public = true OR is_admin_or_professor());

CREATE POLICY "Public read projects" ON projects
  FOR SELECT USING (is_public = true OR is_admin_or_professor());

-- ============================================================
-- SECTION 4: update_publication_with_relations RPC (DB-03)
-- Atomically updates publications + all three join tables in a
-- single implicit transaction.
-- ============================================================

-- Note: actual publications schema uses 'venue' (not journal/volume/issue/pages).
-- Signature is aligned to the real schema columns.
CREATE OR REPLACE FUNCTION update_publication_with_relations(
  p_id                 TEXT,
  p_title              TEXT,
  p_venue              TEXT,
  p_year               INT,
  p_month              INT,
  p_doi                TEXT,
  p_pdf_url            TEXT,
  p_abstract           TEXT,
  p_type               TEXT,
  p_keywords           TEXT[],
  p_bibtex             TEXT,
  p_is_featured        BOOLEAN,
  p_is_public          BOOLEAN,
  p_author_ids         TEXT[],
  p_research_area_ids  TEXT[],
  p_project_ids        TEXT[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Update the publication row itself
  UPDATE publications
  SET
    title        = p_title,
    venue        = p_venue,
    year         = p_year,
    month        = p_month,
    doi          = p_doi,
    pdf_url      = p_pdf_url,
    abstract     = p_abstract,
    type         = p_type::publication_type,
    keywords     = p_keywords,
    bibtex       = p_bibtex,
    is_featured  = p_is_featured,
    is_public    = p_is_public,
    updated_at   = now()
  WHERE id = p_id;

  -- 2. Replace publication_authors (DELETE + INSERT for atomicity)
  DELETE FROM publication_authors WHERE publication_id = p_id;
  INSERT INTO publication_authors (publication_id, member_id, author_order)
    SELECT p_id, unnest(p_author_ids), generate_subscripts(p_author_ids, 1) - 1;

  -- 3. Replace publication_research_areas
  DELETE FROM publication_research_areas WHERE publication_id = p_id;
  INSERT INTO publication_research_areas (publication_id, research_area_id)
    SELECT p_id, unnest(p_research_area_ids);

  -- 4. Replace publication_projects
  DELETE FROM publication_projects WHERE publication_id = p_id;
  INSERT INTO publication_projects (publication_id, project_id)
    SELECT p_id, unnest(p_project_ids);
END;
$$;
