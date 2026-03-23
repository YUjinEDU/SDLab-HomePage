-- ============================================================
-- SD Lab Homepage - Migration 007: Usage History
-- Created: 2026-03-23
-- Purpose: SSH session history and GPU usage log for admin
--          analytics (access history, per-user rankings).
-- ============================================================

-- ============================================================
-- SECTION 1: ssh_session_history — SSH login/logout events
-- ============================================================

CREATE TABLE IF NOT EXISTS ssh_session_history (
  id          BIGSERIAL PRIMARY KEY,
  server_id   UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  username    TEXT NOT NULL,
  terminal    TEXT NOT NULL DEFAULT '',
  remote_host TEXT NOT NULL DEFAULT '',
  login_at    TIMESTAMPTZ NOT NULL,
  logout_at   TIMESTAMPTZ,       -- NULL = still connected
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ssh_history_server_login
  ON ssh_session_history (server_id, login_at DESC);

-- Unique constraint prevents duplicate rows on agent restart
CREATE UNIQUE INDEX idx_ssh_history_unique_session
  ON ssh_session_history (server_id, username, terminal, login_at);

-- ============================================================
-- SECTION 2: gpu_usage_log — Per-minute GPU usage by user
-- ============================================================

CREATE TABLE IF NOT EXISTS gpu_usage_log (
  id               BIGSERIAL PRIMARY KEY,
  server_id        UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  username         TEXT NOT NULL,
  gpu_index        SMALLINT NOT NULL,
  recorded_at      TIMESTAMPTZ NOT NULL,
  memory_used_mb   INTEGER,
  process_name     TEXT
);

CREATE INDEX idx_gpu_usage_log_server_time
  ON gpu_usage_log (server_id, recorded_at DESC);

CREATE INDEX idx_gpu_usage_log_user
  ON gpu_usage_log (server_id, username, recorded_at DESC);

-- ============================================================
-- SECTION 3: Row Level Security
-- ============================================================

ALTER TABLE ssh_session_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpu_usage_log       ENABLE ROW LEVEL SECURITY;

-- Read: authenticated users only (professor page guards access)
-- Write: service_role only (monitoring agent)

CREATE POLICY "Authenticated read ssh_session_history"
  ON ssh_session_history FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read gpu_usage_log"
  ON gpu_usage_log FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- SECTION 4: Update cleanup function (extend retention)
-- ============================================================

CREATE OR REPLACE FUNCTION cleanup_old_metrics()
RETURNS void AS $$
BEGIN
  DELETE FROM server_metrics      WHERE recorded_at < now() - INTERVAL '7 days';
  DELETE FROM gpu_metrics         WHERE recorded_at < now() - INTERVAL '7 days';
  DELETE FROM gpu_processes       WHERE recorded_at < now() - INTERVAL '7 days';
  DELETE FROM disk_partitions     WHERE recorded_at < now() - INTERVAL '7 days';
  DELETE FROM ssh_sessions        WHERE recorded_at < now() - INTERVAL '7 days';
  DELETE FROM disk_usage_users    WHERE recorded_at < now() - INTERVAL '30 days';
  DELETE FROM gpu_usage_log       WHERE recorded_at < now() - INTERVAL '90 days';
  DELETE FROM ssh_session_history WHERE login_at < now() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
