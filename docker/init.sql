-- SD Lab Homepage — exact mirror of Drizzle ORM schema
-- Auto-runs when PostgreSQL container starts fresh

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Content ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS research_areas (
  id             SERIAL PRIMARY KEY,
  slug           TEXT    NOT NULL UNIQUE,
  title          TEXT    NOT NULL,
  short_description TEXT,
  full_description  TEXT,
  icon           TEXT,
  image          TEXT,
  keywords       TEXT[],
  applications   TEXT[],
  display_order  INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS members (
  id                  SERIAL PRIMARY KEY,
  slug                TEXT    NOT NULL UNIQUE,
  name_ko             TEXT    NOT NULL,
  name_en             TEXT,
  "group"             TEXT    NOT NULL,
  position            TEXT,
  department          TEXT,
  image               TEXT,
  email               TEXT,
  links               JSONB,
  research_keywords   TEXT[],
  bio                 TEXT,
  education           JSONB,
  career              JSONB,
  display_order       INTEGER DEFAULT 0,
  nas_folder_name     TEXT    -- NAS 개인 폴더 이름 (예: '김민건')
);

CREATE TABLE IF NOT EXISTS projects (
  id                SERIAL PRIMARY KEY,
  slug              TEXT    NOT NULL UNIQUE,
  title             TEXT    NOT NULL,
  status            TEXT    NOT NULL,
  category          TEXT,
  short_description TEXT,
  full_description  TEXT,
  organization      TEXT,
  program_type      TEXT,
  budget            INTEGER,
  start_date        TIMESTAMP,
  end_date          TIMESTAMP,
  thumbnail         TEXT,
  tags              TEXT[],
  demo_url          TEXT,
  is_featured       BOOLEAN DEFAULT FALSE,
  is_public         BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS publications (
  id               SERIAL PRIMARY KEY,
  slug             TEXT    NOT NULL UNIQUE,
  title            TEXT    NOT NULL,
  authors          TEXT    NOT NULL,
  type             TEXT    NOT NULL,
  is_international BOOLEAN DEFAULT FALSE,
  venue            TEXT,
  year             INTEGER NOT NULL,
  month            INTEGER,
  doi              TEXT,
  pdf_url          TEXT,
  abstract         TEXT,
  keywords         TEXT[],
  bibtex           TEXT,
  is_featured      BOOLEAN DEFAULT FALSE,
  is_public        BOOLEAN DEFAULT TRUE,
  index_type       TEXT,
  volume_info      TEXT
);

CREATE TABLE IF NOT EXISTS news (
  id        SERIAL PRIMARY KEY,
  slug      TEXT      NOT NULL UNIQUE,
  title     TEXT      NOT NULL,
  summary   TEXT,
  category  TEXT      NOT NULL,
  date      TIMESTAMP NOT NULL,
  is_pinned BOOLEAN   DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS contact_info (
  id               SERIAL PRIMARY KEY,
  lab_name_ko      TEXT,
  lab_name_en      TEXT,
  professor_name   TEXT,
  professor_title  TEXT,
  professor_email  TEXT,
  professor_phone  TEXT,
  professor_office TEXT,
  lab_room         TEXT,
  lab_phone        TEXT,
  building         TEXT,
  department       TEXT,
  university       TEXT,
  address          TEXT,
  map_embed_url    TEXT
);

-- ─── Join Tables ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS project_members (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  member_id  INTEGER NOT NULL REFERENCES members(id)  ON DELETE CASCADE,
  PRIMARY KEY (project_id, member_id)
);

CREATE TABLE IF NOT EXISTS project_research_areas (
  project_id       INTEGER NOT NULL REFERENCES projects(id)       ON DELETE CASCADE,
  research_area_id INTEGER NOT NULL REFERENCES research_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, research_area_id)
);

CREATE TABLE IF NOT EXISTS publication_authors (
  publication_id INTEGER NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  member_id      INTEGER NOT NULL REFERENCES members(id)      ON DELETE CASCADE,
  author_order   INTEGER NOT NULL,
  PRIMARY KEY (publication_id, member_id)
);

CREATE TABLE IF NOT EXISTS publication_research_areas (
  publication_id   INTEGER NOT NULL REFERENCES publications(id)   ON DELETE CASCADE,
  research_area_id INTEGER NOT NULL REFERENCES research_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (publication_id, research_area_id)
);

CREATE TABLE IF NOT EXISTS publication_projects (
  publication_id INTEGER NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  project_id     INTEGER NOT NULL REFERENCES projects(id)     ON DELETE CASCADE,
  PRIMARY KEY (publication_id, project_id)
);

CREATE TABLE IF NOT EXISTS news_projects (
  news_id    INTEGER NOT NULL REFERENCES news(id)     ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  PRIMARY KEY (news_id, project_id)
);

CREATE TABLE IF NOT EXISTS news_publications (
  news_id        INTEGER NOT NULL REFERENCES news(id)         ON DELETE CASCADE,
  publication_id INTEGER NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  PRIMARY KEY (news_id, publication_id)
);

-- ─── Auth ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT    NOT NULL UNIQUE,
  hashed_password TEXT    NOT NULL,
  role            TEXT    NOT NULL DEFAULT 'member' CHECK (role IN ('member','professor','admin')),
  member_id       INTEGER REFERENCES members(id),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── Monitoring ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS servers (
  id         SERIAL PRIMARY KEY,
  name       TEXT    NOT NULL,
  host       TEXT    NOT NULL,
  is_online  BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS server_metrics (
  id           SERIAL PRIMARY KEY,
  server_id    INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  cpu_usage    REAL,
  memory_used  REAL,
  memory_total REAL,
  recorded_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gpu_metrics (
  id              SERIAL PRIMARY KEY,
  server_id       INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  gpu_index       INTEGER NOT NULL,
  gpu_name        TEXT,
  utilization_gpu REAL,
  memory_used     REAL,
  memory_total    REAL,
  temperature_gpu REAL,
  recorded_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gpu_processes (
  id           SERIAL PRIMARY KEY,
  server_id    INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  gpu_index    INTEGER NOT NULL,
  pid          INTEGER,
  process_name TEXT,
  used_memory  REAL,
  username     TEXT,
  recorded_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disk_partitions (
  id          SERIAL PRIMARY KEY,
  server_id   INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  device      TEXT,
  mountpoint  TEXT,
  total       REAL,
  used        REAL,
  recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disk_usage_users (
  id          SERIAL PRIMARY KEY,
  server_id   INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  username    TEXT,
  usage_bytes REAL,
  recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ssh_sessions (
  id        SERIAL PRIMARY KEY,
  server_id INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  username  TEXT,
  from_host TEXT,
  login_at  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ssh_session_history (
  id        SERIAL PRIMARY KEY,
  server_id INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  username  TEXT,
  from_host TEXT,
  login_at  TIMESTAMP,
  logout_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gpu_usage_log (
  id          SERIAL PRIMARY KEY,
  server_id   INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  username    TEXT,
  gpu_index   INTEGER,
  used_memory REAL,
  recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  is_pinned  BOOLEAN NOT NULL DEFAULT false,
  author_id  INTEGER REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Seed Data ──────────────────────────────────────────────────

INSERT INTO contact_info (lab_name_ko, lab_name_en, professor_name, professor_title, professor_email, professor_phone, professor_office, lab_room, lab_phone, building, department, university, address)
VALUES ('SD Lab', 'SD Lab', '교수 이름', '직책', 'professor@sdlab.ac.kr', '', '', '', '', '건물명', '학과명', '대학교명', '주소')
ON CONFLICT DO NOTHING;

-- ⚠️  SECURITY: Default admin account for first-time setup ONLY.
--    Password: Admin@1234 (bcryptjs $2b$12$ hash)
--    CHANGE THIS PASSWORD IMMEDIATELY after first login via /professor/settings
--    or update this hash before running: node -e "require('bcryptjs').hash('NewPass',12).then(console.log)"
INSERT INTO users (email, hashed_password, role)
VALUES ('admin@sdlab.org', '$2b$12$l1b9vZWbLK6Sd0S4XJ0yT.KIzLgOJn3AWymxOg7OHY7uSPhzEKJ0e', 'admin')
ON CONFLICT (email) DO NOTHING;
