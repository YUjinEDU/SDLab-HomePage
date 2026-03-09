-- ============================================================
-- SD Lab Homepage - Initial Database Schema
-- Created: 2026-03-08
-- ============================================================

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================

CREATE TYPE member_group AS ENUM (
  'professor', 'phd', 'ms', 'undergraduate', 'alumni'
);

CREATE TYPE publication_type AS ENUM (
  'journal', 'conference', 'patent', 'report', 'thesis'
);

CREATE TYPE project_status AS ENUM (
  'planned', 'active', 'completed', 'archived'
);

CREATE TYPE board_category AS ENUM (
  'notice', 'award', 'event', 'acceptance', 'recruitment'
);

CREATE TYPE user_role AS ENUM (
  'member', 'professor', 'admin'
);

-- ============================================================
-- 2. CORE TABLES
-- ============================================================

-- 멤버 (연구원 프로필)
CREATE TABLE members (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_ko TEXT NOT NULL,
  name_en TEXT NOT NULL,
  "group" member_group NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT '컴퓨터인공지능학부',
  image TEXT,
  email TEXT,
  links JSONB NOT NULL DEFAULT '{}',
  research_keywords TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  education JSONB NOT NULL DEFAULT '[]',
  career JSONB NOT NULL DEFAULT '[]',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 연구 분야
CREATE TABLE research_areas (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🔬',
  image TEXT,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  applications TEXT[] NOT NULL DEFAULT '{}',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 논문/특허
CREATE TABLE publications (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL DEFAULT '{}',
  type publication_type NOT NULL,
  venue TEXT NOT NULL,
  year INT NOT NULL,
  month INT,
  doi TEXT,
  pdf_url TEXT,
  abstract TEXT,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  bibtex TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 프로젝트
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  status project_status NOT NULL DEFAULT 'active',
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  organization TEXT NOT NULL,
  program_type TEXT,
  budget TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  thumbnail TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  demo_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 소식/공지
CREATE TABLE news (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category board_category NOT NULL DEFAULT 'notice',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 사용자 프로필 (Supabase Auth 연동, members 이후 생성)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role user_role NOT NULL DEFAULT 'member',
  member_id TEXT REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 연락처 (단일 행)
CREATE TABLE contact_info (
  id TEXT PRIMARY KEY DEFAULT 'main',
  lab_name_ko TEXT NOT NULL,
  lab_name_en TEXT NOT NULL,
  professor_name TEXT NOT NULL,
  professor_title TEXT NOT NULL,
  professor_email TEXT NOT NULL,
  building TEXT NOT NULL,
  professor_office TEXT NOT NULL,
  lab_room TEXT NOT NULL,
  professor_phone TEXT NOT NULL,
  lab_phone TEXT NOT NULL,
  department TEXT NOT NULL,
  university TEXT NOT NULL,
  address TEXT NOT NULL,
  map_embed_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. JOIN TABLES (다대다 관계)
-- ============================================================

-- 논문 ↔ 멤버 (저자)
CREATE TABLE publication_authors (
  publication_id TEXT NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  author_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (publication_id, member_id)
);

-- 논문 ↔ 연구분야
CREATE TABLE publication_research_areas (
  publication_id TEXT NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  research_area_id TEXT NOT NULL REFERENCES research_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (publication_id, research_area_id)
);

-- 논문 ↔ 프로젝트
CREATE TABLE publication_projects (
  publication_id TEXT NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  PRIMARY KEY (publication_id, project_id)
);

-- 프로젝트 ↔ 멤버
CREATE TABLE project_members (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, member_id)
);

-- 프로젝트 ↔ 연구분야
CREATE TABLE project_research_areas (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  research_area_id TEXT NOT NULL REFERENCES research_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, research_area_id)
);

-- 소식 ↔ 프로젝트
CREATE TABLE news_projects (
  news_id TEXT NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  PRIMARY KEY (news_id, project_id)
);

-- 소식 ↔ 논문
CREATE TABLE news_publications (
  news_id TEXT NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  publication_id TEXT NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  PRIMARY KEY (news_id, publication_id)
);

-- ============================================================
-- 4. INDEXES
-- ============================================================

CREATE INDEX idx_members_group ON members("group");
CREATE INDEX idx_members_slug ON members(slug);
CREATE INDEX idx_publications_type ON publications(type);
CREATE INDEX idx_publications_year ON publications(year);
CREATE INDEX idx_publications_slug ON publications(slug);
CREATE INDEX idx_publications_featured ON publications(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_featured ON projects(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_date ON news(date DESC);
CREATE INDEX idx_news_pinned ON news(is_pinned) WHERE is_pinned = TRUE;

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- 모든 테이블에 RLS 활성화
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_research_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_research_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (누구나 공개 데이터 조회 가능)
CREATE POLICY "Public read members" ON members FOR SELECT USING (true);
CREATE POLICY "Public read research_areas" ON research_areas FOR SELECT USING (true);
CREATE POLICY "Public read publications" ON publications FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public read contact_info" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Public read publication_authors" ON publication_authors FOR SELECT USING (true);
CREATE POLICY "Public read publication_research_areas" ON publication_research_areas FOR SELECT USING (true);
CREATE POLICY "Public read publication_projects" ON publication_projects FOR SELECT USING (true);
CREATE POLICY "Public read project_members" ON project_members FOR SELECT USING (true);
CREATE POLICY "Public read project_research_areas" ON project_research_areas FOR SELECT USING (true);
CREATE POLICY "Public read news_projects" ON news_projects FOR SELECT USING (true);
CREATE POLICY "Public read news_publications" ON news_publications FOR SELECT USING (true);

-- 프로필: 본인만 읽기
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- 관리자/교수 쓰기 정책 헬퍼 함수
CREATE OR REPLACE FUNCTION is_admin_or_professor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'professor')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 관리자/교수만 데이터 생성/수정/삭제
CREATE POLICY "Admin/Prof insert members" ON members FOR INSERT WITH CHECK (is_admin_or_professor());
CREATE POLICY "Admin/Prof update members" ON members FOR UPDATE USING (is_admin_or_professor());
CREATE POLICY "Admin/Prof delete members" ON members FOR DELETE USING (is_admin_or_professor());

CREATE POLICY "Admin/Prof insert research_areas" ON research_areas FOR INSERT WITH CHECK (is_admin_or_professor());
CREATE POLICY "Admin/Prof update research_areas" ON research_areas FOR UPDATE USING (is_admin_or_professor());
CREATE POLICY "Admin/Prof delete research_areas" ON research_areas FOR DELETE USING (is_admin_or_professor());

CREATE POLICY "Admin/Prof insert publications" ON publications FOR INSERT WITH CHECK (is_admin_or_professor());
CREATE POLICY "Admin/Prof update publications" ON publications FOR UPDATE USING (is_admin_or_professor());
CREATE POLICY "Admin/Prof delete publications" ON publications FOR DELETE USING (is_admin_or_professor());

CREATE POLICY "Admin/Prof insert projects" ON projects FOR INSERT WITH CHECK (is_admin_or_professor());
CREATE POLICY "Admin/Prof update projects" ON projects FOR UPDATE USING (is_admin_or_professor());
CREATE POLICY "Admin/Prof delete projects" ON projects FOR DELETE USING (is_admin_or_professor());

CREATE POLICY "Admin/Prof insert news" ON news FOR INSERT WITH CHECK (is_admin_or_professor());
CREATE POLICY "Admin/Prof update news" ON news FOR UPDATE USING (is_admin_or_professor());
CREATE POLICY "Admin/Prof delete news" ON news FOR DELETE USING (is_admin_or_professor());

CREATE POLICY "Admin/Prof update contact_info" ON contact_info FOR UPDATE USING (is_admin_or_professor());

-- Join table 쓰기 정책
CREATE POLICY "Admin/Prof manage publication_authors" ON publication_authors FOR ALL USING (is_admin_or_professor());
CREATE POLICY "Admin/Prof manage publication_research_areas" ON publication_research_areas FOR ALL USING (is_admin_or_professor());
CREATE POLICY "Admin/Prof manage publication_projects" ON publication_projects FOR ALL USING (is_admin_or_professor());
CREATE POLICY "Admin/Prof manage project_members" ON project_members FOR ALL USING (is_admin_or_professor());
CREATE POLICY "Admin/Prof manage project_research_areas" ON project_research_areas FOR ALL USING (is_admin_or_professor());
CREATE POLICY "Admin/Prof manage news_projects" ON news_projects FOR ALL USING (is_admin_or_professor());
CREATE POLICY "Admin/Prof manage news_publications" ON news_publications FOR ALL USING (is_admin_or_professor());

-- 프로필 관리
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin manage profiles" ON profiles FOR ALL USING (is_admin_or_professor());

-- ============================================================
-- 6. UPDATED_AT 자동 갱신 트리거
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_research_areas_updated_at BEFORE UPDATE ON research_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_publications_updated_at BEFORE UPDATE ON publications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_contact_info_updated_at BEFORE UPDATE ON contact_info FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
