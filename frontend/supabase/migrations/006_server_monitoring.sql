-- ============================================================
-- SD Lab Homepage - Migration 006: Server Monitoring
-- Created: 2026-03-23
-- Purpose: Tables for collecting and displaying server resource
--          metrics (CPU, RAM, GPU, disk, SSH sessions).
--          Data is pushed by an agent running on each server
--          using the Supabase service_role key.
-- ============================================================

-- ============================================================
-- SECTION 1: servers — Server registry
-- ============================================================

CREATE TABLE IF NOT EXISTS servers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  hostname      TEXT NOT NULL,
  ip_address    TEXT NOT NULL,
  description   TEXT,
  gpu_models    JSONB,
  storage_paths JSONB,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER tr_servers_updated_at
  BEFORE UPDATE ON servers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SECTION 2: server_metrics — CPU/RAM per server (1 min interval)
-- ============================================================

CREATE TABLE IF NOT EXISTS server_metrics (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id          UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  cpu_percent        REAL,
  cpu_per_core       JSONB,
  memory_total_bytes BIGINT,
  memory_used_bytes  BIGINT,
  memory_percent     REAL,
  load_avg_1m        REAL,
  load_avg_5m        REAL,
  load_avg_15m       REAL,
  recorded_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_server_metrics_server_time
  ON server_metrics (server_id, recorded_at DESC);

-- ============================================================
-- SECTION 3: gpu_metrics — Per-GPU metrics (1 min interval)
-- ============================================================

CREATE TABLE IF NOT EXISTS gpu_metrics (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id         UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  gpu_index         SMALLINT NOT NULL,
  gpu_name          TEXT,
  gpu_util_percent  REAL,
  memory_total_mb   INTEGER,
  memory_used_mb    INTEGER,
  memory_percent    REAL,
  temperature_c     SMALLINT,
  power_draw_w      REAL,
  power_limit_w     REAL,
  fan_speed_percent SMALLINT,
  recorded_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gpu_metrics_server_time
  ON gpu_metrics (server_id, recorded_at DESC);

-- ============================================================
-- SECTION 4: gpu_processes — Who's using GPU (1 min snapshot)
-- ============================================================

CREATE TABLE IF NOT EXISTS gpu_processes (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id          UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  gpu_index          SMALLINT NOT NULL,
  pid                INTEGER NOT NULL,
  username           TEXT NOT NULL,
  process_name       TEXT,
  gpu_memory_used_mb INTEGER,
  cpu_percent        REAL,
  command            TEXT,
  started_at         TIMESTAMPTZ,
  recorded_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gpu_processes_server_time
  ON gpu_processes (server_id, recorded_at DESC);

-- ============================================================
-- SECTION 5: disk_partitions — Partition usage (1 min interval)
-- ============================================================

CREATE TABLE IF NOT EXISTS disk_partitions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id   UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  device      TEXT,
  mount_point TEXT NOT NULL,
  fs_type     TEXT,
  total_bytes BIGINT,
  used_bytes  BIGINT,
  free_bytes  BIGINT,
  percent     REAL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_disk_partitions_server_time
  ON disk_partitions (server_id, recorded_at DESC);

-- ============================================================
-- SECTION 6: disk_usage_users — Per-user disk usage (1 day interval)
-- ============================================================

CREATE TABLE IF NOT EXISTS disk_usage_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id   UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  base_path   TEXT NOT NULL,
  username    TEXT NOT NULL,
  bytes_used  BIGINT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_disk_usage_users_server_time
  ON disk_usage_users (server_id, recorded_at DESC);

-- ============================================================
-- SECTION 7: ssh_sessions — Current SSH sessions (1 min snapshot)
-- ============================================================

CREATE TABLE IF NOT EXISTS ssh_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id   UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  username    TEXT NOT NULL,
  terminal    TEXT,
  remote_host TEXT,
  login_at    TIMESTAMPTZ,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ssh_sessions_server_time
  ON ssh_sessions (server_id, recorded_at DESC);

-- ============================================================
-- SECTION 8: Row Level Security
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE servers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_metrics   ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpu_metrics      ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpu_processes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE disk_partitions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE disk_usage_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ssh_sessions     ENABLE ROW LEVEL SECURITY;

-- Read: authenticated users only
-- Write: service_role only (no user-level INSERT/UPDATE/DELETE policies).
-- The monitoring agent uses the service_role key which bypasses RLS.

CREATE POLICY "Authenticated read servers"
  ON servers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read server_metrics"
  ON server_metrics FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read gpu_metrics"
  ON gpu_metrics FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read gpu_processes"
  ON gpu_processes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read disk_partitions"
  ON disk_partitions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read disk_usage_users"
  ON disk_usage_users FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read ssh_sessions"
  ON ssh_sessions FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- SECTION 9: Data Cleanup Function
-- ============================================================

-- Deletes old metric data to keep the database size manageable.
-- Retention: 7 days for high-frequency tables, 30 days for disk_usage_users.
-- Schedule this via pg_cron or Supabase Dashboard > Database > Extensions > pg_cron:
--   SELECT cron.schedule('cleanup-server-metrics', '0 3 * * *', 'SELECT cleanup_old_metrics()');
CREATE OR REPLACE FUNCTION cleanup_old_metrics()
RETURNS void AS $$
BEGIN
  DELETE FROM server_metrics   WHERE recorded_at < now() - INTERVAL '7 days';
  DELETE FROM gpu_metrics      WHERE recorded_at < now() - INTERVAL '7 days';
  DELETE FROM gpu_processes    WHERE recorded_at < now() - INTERVAL '7 days';
  DELETE FROM disk_partitions  WHERE recorded_at < now() - INTERVAL '7 days';
  DELETE FROM ssh_sessions     WHERE recorded_at < now() - INTERVAL '7 days';
  DELETE FROM disk_usage_users WHERE recorded_at < now() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SECTION 10: Seed Data — Lab Servers
-- ============================================================

INSERT INTO servers (name, hostname, ip_address, description, gpu_models, storage_paths) VALUES
  (
    '222 서버',
    'sd-222',
    '168.188.125.222',
    'SD Lab 주 연구 서버 (222호)',
    '["NVIDIA RTX A6000", "NVIDIA RTX A6000"]'::jsonb,
    '["/mnt/hdd1", "/mnt/hdd2"]'::jsonb
  ),
  (
    '232 서버',
    'sd-232',
    '168.188.127.232',
    'SD Lab 보조 연구 서버 (232호)',
    '["NVIDIA RTX A6000"]'::jsonb,
    '[]'::jsonb
  );
