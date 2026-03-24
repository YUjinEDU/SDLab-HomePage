#!/usr/bin/env python3
"""
SD Lab Server Monitor Agent

Collects system metrics (CPU, memory, GPU, disk, SSH sessions) and sends
them to Supabase via REST API. Designed to run as a systemd daemon.

Compatible with Python 3.8+.
"""

import json
import logging
import os
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

try:
    import psutil
except ImportError:
    print("ERROR: psutil is required. Install with: pip install psutil", file=sys.stderr)
    sys.exit(1)

try:
    import requests
except ImportError:
    print("ERROR: requests is required. Install with: pip install requests", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
SERVER_ID = os.environ.get("SERVER_ID", "")
try:
    COLLECTION_INTERVAL = max(10, int(os.environ.get("COLLECTION_INTERVAL", "60")))
except ValueError:
    COLLECTION_INTERVAL = 60
DISK_USAGE_PATHS = [
    p.strip()
    for p in os.environ.get("DISK_USAGE_PATHS", "/home").split(",")
    if p.strip()
]
try:
    DISK_USAGE_INTERVAL = max(3600, int(os.environ.get("DISK_USAGE_INTERVAL", "86400")))
except ValueError:
    DISK_USAGE_INTERVAL = 86400

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S%z",
    stream=sys.stdout,
)
logger = logging.getLogger("sdlab-monitor")

# ---------------------------------------------------------------------------
# Supabase helpers
# ---------------------------------------------------------------------------


def _headers():
    """Return standard Supabase REST headers."""
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }


def supabase_post(table, data):
    """POST *data* (dict or list[dict]) to the given Supabase table."""
    url = "{}/rest/v1/{}".format(SUPABASE_URL, table)
    try:
        resp = requests.post(url, headers=_headers(), json=data, timeout=15)
        if resp.status_code >= 400:
            logger.error(
                "Supabase POST %s failed (HTTP %s)",
                table,
                resp.status_code,
            )
        return resp
    except requests.RequestException as exc:
        logger.error("Supabase POST %s request error: %s", table, exc)
        return None


def supabase_post_upsert(table, data, on_conflict):
    """POST with upsert (ON CONFLICT DO NOTHING) via Prefer header."""
    url = "{}/rest/v1/{}".format(SUPABASE_URL, table)
    headers = _headers()
    headers["Prefer"] = "resolution=ignore-duplicates,return=minimal"
    try:
        resp = requests.post(
            url,
            headers=headers,
            json=data,
            params={"on_conflict": on_conflict},
            timeout=15,
        )
        if resp.status_code >= 400:
            logger.error(
                "Supabase UPSERT %s failed (HTTP %s): %s",
                table,
                resp.status_code,
                resp.text[:200],
            )
        return resp
    except requests.RequestException as exc:
        logger.error("Supabase UPSERT %s request error: %s", table, exc)
        return None


def supabase_patch(table, params, data):
    """PATCH rows in a Supabase table matching *params*."""
    url = "{}/rest/v1/{}".format(SUPABASE_URL, table)
    try:
        resp = requests.patch(url, headers=_headers(), params=params, json=data, timeout=15)
        if resp.status_code >= 400:
            logger.error(
                "Supabase PATCH %s failed (HTTP %s): %s",
                table,
                resp.status_code,
                resp.text[:200],
            )
        return resp
    except requests.RequestException as exc:
        logger.error("Supabase PATCH %s request error: %s", table, exc)
        return None


def supabase_get(table, params):
    """GET rows from a Supabase table matching *params*. Returns list or None."""
    url = "{}/rest/v1/{}".format(SUPABASE_URL, table)
    try:
        resp = requests.get(url, headers=_headers(), params=params, timeout=15)
        if resp.status_code >= 400:
            logger.error(
                "Supabase GET %s failed (HTTP %s)",
                table,
                resp.status_code,
            )
            return None
        return resp.json()
    except requests.RequestException as exc:
        logger.error("Supabase GET %s request error: %s", table, exc)
        return None


def supabase_delete(table, params):
    """DELETE rows from a Supabase table matching *params* (query string dict)."""
    url = "{}/rest/v1/{}".format(SUPABASE_URL, table)
    try:
        resp = requests.delete(url, headers=_headers(), params=params, timeout=15)
        if resp.status_code >= 400:
            logger.error(
                "Supabase DELETE %s failed (HTTP %s)",
                table,
                resp.status_code,
            )
        return resp
    except requests.RequestException as exc:
        logger.error("Supabase DELETE %s request error: %s", table, exc)
        return None


# ---------------------------------------------------------------------------
# Timestamp helper
# ---------------------------------------------------------------------------


def now_iso():
    """Return current UTC time in ISO 8601 format."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


# ---------------------------------------------------------------------------
# GPU metrics collection
# ---------------------------------------------------------------------------

_GPU_QUERY_FIELDS = (
    "index,name,utilization.gpu,memory.total,memory.used,"
    "temperature.gpu,power.draw,power.limit,fan.speed"
)

_GPU_PROCESS_FIELDS = "gpu_uuid,pid,used_memory"


def _run_nvidia_smi(query_type, fields):
    """Run nvidia-smi and return lines of CSV output, or None on failure."""
    cmd = [
        "nvidia-smi",
        "--query-{}={}".format(query_type, fields),
        "--format=csv,noheader,nounits",
    ]
    try:
        result = subprocess.run(
            cmd, capture_output=True, text=True, timeout=10
        )
        if result.returncode != 0:
            logger.warning("nvidia-smi returned %d: %s", result.returncode, result.stderr.strip())
            return None
        return [line.strip() for line in result.stdout.strip().splitlines() if line.strip()]
    except FileNotFoundError:
        logger.info("nvidia-smi not found; skipping GPU metrics.")
        return None
    except subprocess.TimeoutExpired:
        logger.warning("nvidia-smi timed out.")
        return None
    except Exception as exc:
        logger.warning("nvidia-smi error: %s", exc)
        return None


def _safe_float(value, default=0.0):
    """Convert a string to float, returning *default* on failure."""
    try:
        return float(value.strip())
    except (ValueError, AttributeError):
        return default


def _safe_int(value, default=0):
    """Convert a string to int, returning *default* on failure."""
    try:
        return int(value.strip())
    except (ValueError, AttributeError):
        return default


def _get_gpu_uuid_to_index():
    """Return a mapping from GPU UUID to GPU index."""
    cmd = [
        "nvidia-smi",
        "--query-gpu=uuid,index",
        "--format=csv,noheader,nounits",
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        if result.returncode != 0:
            return {}
        mapping = {}
        for line in result.stdout.strip().splitlines():
            parts = [p.strip() for p in line.split(",")]
            if len(parts) >= 2:
                mapping[parts[0]] = _safe_int(parts[1])
        return mapping
    except Exception:
        return {}


def collect_gpu_metrics():
    """Collect GPU utilisation metrics. Returns list of dicts or empty list."""
    lines = _run_nvidia_smi("gpu", _GPU_QUERY_FIELDS)
    if not lines:
        return []

    ts = now_iso()
    rows = []
    for line in lines:
        parts = [p.strip() for p in line.split(",")]
        if len(parts) < 9:
            continue
        mem_total = _safe_int(parts[3])
        mem_used = _safe_int(parts[4])
        mem_pct = round(mem_used / mem_total * 100, 1) if mem_total > 0 else 0.0
        rows.append({
            "server_id": SERVER_ID,
            "gpu_index": _safe_int(parts[0]),
            "gpu_name": parts[1],
            "gpu_util_percent": _safe_float(parts[2]),
            "memory_total_mb": mem_total,
            "memory_used_mb": mem_used,
            "memory_percent": mem_pct,
            "temperature_c": _safe_int(parts[5]),
            "power_draw_w": _safe_float(parts[6]),
            "power_limit_w": _safe_float(parts[7]),
            "fan_speed_percent": _safe_int(parts[8]),
            "recorded_at": ts,
        })
    return rows


def collect_gpu_processes():
    """Collect running GPU processes. Returns list of dicts or empty list."""
    lines = _run_nvidia_smi("compute-apps", _GPU_PROCESS_FIELDS)
    if not lines:
        return []

    uuid_map = _get_gpu_uuid_to_index()
    ts = now_iso()
    rows = []

    for line in lines:
        parts = [p.strip() for p in line.split(",")]
        if len(parts) < 3:
            continue

        gpu_uuid = parts[0]
        pid = _safe_int(parts[1])
        mem_mb = _safe_int(parts[2])
        gpu_index = uuid_map.get(gpu_uuid, -1)

        username = ""
        process_name = ""
        cpu_pct = 0.0
        command = ""
        started_at = None

        try:
            proc = psutil.Process(pid)
            username = proc.username()
            process_name = proc.name()
            cpu_pct = proc.cpu_percent(interval=0)
            cmdline = proc.cmdline()
            command = " ".join(cmdline)[:512] if cmdline else process_name
            started_at = datetime.fromtimestamp(
                proc.create_time(), tz=timezone.utc
            ).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
        except Exception as exc:
            logger.debug("psutil lookup failed for pid %d: %s", pid, exc)

        row = {
            "server_id": SERVER_ID,
            "gpu_index": gpu_index,
            "pid": pid,
            "username": username,
            "process_name": process_name,
            "gpu_memory_used_mb": mem_mb,
            "cpu_percent": cpu_pct,
            "command": command,
            "recorded_at": ts,
        }
        if started_at:
            row["started_at"] = started_at
        rows.append(row)

    return rows


def log_gpu_usage(gpu_procs):
    """Insert aggregated GPU usage into gpu_usage_log (one row per user per GPU)."""
    if not gpu_procs:
        return

    ts = now_iso()
    # Aggregate memory per (username, gpu_index)
    agg = {}
    for proc in gpu_procs:
        username = proc.get("username", "")
        if not username:
            continue
        gpu_index = proc.get("gpu_index", 0)
        key = (username, gpu_index)
        if key not in agg:
            agg[key] = {
                "memory_used_mb": 0,
                "process_name": proc.get("process_name", ""),
            }
        agg[key]["memory_used_mb"] += int(proc.get("gpu_memory_used_mb") or 0)

    rows = [
        {
            "server_id": SERVER_ID,
            "username": username,
            "gpu_index": gpu_index,
            "recorded_at": ts,
            "memory_used_mb": data["memory_used_mb"],
            "process_name": data["process_name"],
        }
        for (username, gpu_index), data in agg.items()
    ]
    if rows:
        supabase_post("gpu_usage_log", rows)


# ---------------------------------------------------------------------------
# CPU / Memory metrics
# ---------------------------------------------------------------------------


def collect_server_metrics():
    """Collect CPU and memory metrics. Returns a single dict."""
    cpu_pct = psutil.cpu_percent(interval=1)
    cpu_per_core = psutil.cpu_percent(percpu=True)

    try:
        load1, load5, load15 = os.getloadavg()
    except (AttributeError, OSError):
        # os.getloadavg() is not available on Windows
        load1, load5, load15 = 0.0, 0.0, 0.0

    mem = psutil.virtual_memory()

    return {
        "server_id": SERVER_ID,
        "cpu_percent": cpu_pct,
        "cpu_per_core": cpu_per_core,
        "memory_total_bytes": mem.total,
        "memory_used_bytes": mem.used,
        "memory_percent": mem.percent,
        "load_avg_1m": round(load1, 2),
        "load_avg_5m": round(load5, 2),
        "load_avg_15m": round(load15, 2),
        "recorded_at": now_iso(),
    }


# ---------------------------------------------------------------------------
# Disk partitions
# ---------------------------------------------------------------------------


def collect_disk_partitions():
    """Collect disk partition usage. Returns list of dicts."""
    ts = now_iso()
    rows = []
    try:
        partitions = psutil.disk_partitions(all=False)
    except Exception as exc:
        logger.warning("Failed to read disk partitions: %s", exc)
        return rows

    for part in partitions:
        try:
            usage = psutil.disk_usage(part.mountpoint)
        except (PermissionError, OSError):
            continue
        rows.append({
            "server_id": SERVER_ID,
            "device": part.device,
            "mount_point": part.mountpoint,
            "fs_type": part.fstype,
            "total_bytes": usage.total,
            "used_bytes": usage.used,
            "free_bytes": usage.free,
            "percent": usage.percent,
            "recorded_at": ts,
        })
    return rows


# ---------------------------------------------------------------------------
# Disk usage per user (heavy — runs once per day)
# ---------------------------------------------------------------------------

_last_disk_usage_run = 0.0


def collect_disk_usage_users():
    """Run `du -sb` on configured paths to get per-user disk usage.

    Returns list of dicts. Only runs once per DISK_USAGE_INTERVAL seconds.
    """
    global _last_disk_usage_run

    now = time.time()
    if now - _last_disk_usage_run < DISK_USAGE_INTERVAL:
        return []

    ts = now_iso()
    rows = []

    for base_path in DISK_USAGE_PATHS:
        base = Path(base_path)
        if not base.is_dir():
            logger.info("Disk usage path %s does not exist; skipping.", base_path)
            continue

        try:
            subdirs = [str(d) for d in base.iterdir() if d.is_dir()]
        except PermissionError:
            logger.warning("Permission denied listing %s", base_path)
            continue

        if not subdirs:
            continue

        # Run du per-directory to avoid timeout on large filesystems
        for subdir in subdirs:
            username = Path(subdir).name
            cmd = ["du", "-sb", "--", subdir]
            try:
                result = subprocess.run(
                    cmd, capture_output=True, text=True, timeout=300
                )
            except FileNotFoundError:
                logger.warning("du command not found; skipping disk usage collection.")
                break
            except subprocess.TimeoutExpired:
                logger.warning("du timed out on %s/%s", base_path, username)
                continue

            line = result.stdout.strip()
            if not line:
                continue
            parts = line.split("\t", 1)
            if len(parts) < 2:
                continue
            bytes_used = _safe_int(parts[0])
            rows.append({
                "server_id": SERVER_ID,
                "base_path": base_path,
                "username": username,
                "bytes_used": bytes_used,
                "recorded_at": ts,
            })

    _last_disk_usage_run = now
    if rows:
        logger.info("Collected disk usage for %d user directories.", len(rows))
    return rows


# ---------------------------------------------------------------------------
# SSH sessions (snapshot + history tracking)
# ---------------------------------------------------------------------------

# In-memory state: maps (username, terminal, remote_host) → login_at ISO string
_prev_ssh_sessions = {}


def _init_ssh_session_state():
    """Load open SSH sessions from history table to initialise diff state on startup.

    This prevents duplicate inserts if the agent is restarted while users are
    logged in.
    """
    global _prev_ssh_sessions
    rows = supabase_get(
        "ssh_session_history",
        {
            "server_id": "eq." + SERVER_ID,
            "logout_at": "is.null",
            "select": "username,terminal,remote_host,login_at",
        },
    )
    if rows:
        _prev_ssh_sessions = {
            (
                r.get("username", ""),
                r.get("terminal") or "",
                r.get("remote_host") or "",
            ): r["login_at"]
            for r in rows
        }
        logger.info(
            "Loaded %d open SSH sessions from history.", len(_prev_ssh_sessions)
        )


def collect_ssh_sessions():
    """Collect current logged-in user sessions. Returns list of dicts."""
    ts = now_iso()
    rows = []
    try:
        users = psutil.users()
    except Exception as exc:
        logger.warning("Failed to read user sessions: %s", exc)
        return rows

    for u in users:
        login_at = datetime.fromtimestamp(
            u.started, tz=timezone.utc
        ).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
        rows.append({
            "server_id": SERVER_ID,
            "username": u.name,
            "terminal": u.terminal or "",
            "remote_host": u.host or "",
            "login_at": login_at,
            "recorded_at": ts,
        })
    return rows


def update_ssh_session_history(current_sessions):
    """Diff current SSH sessions against previous state, recording events.

    Inserts rows for new logins (with upsert to handle restarts gracefully)
    and patches logout_at for ended sessions.
    """
    global _prev_ssh_sessions

    ts = now_iso()
    current = {
        (
            r["username"],
            r.get("terminal", "") or "",
            r.get("remote_host", "") or "",
        ): r["login_at"]
        for r in current_sessions
    }

    # New sessions: present now but not before
    for key, login_at in current.items():
        if key not in _prev_ssh_sessions:
            username, terminal, remote_host = key
            supabase_post_upsert(
                "ssh_session_history",
                {
                    "server_id": SERVER_ID,
                    "username": username,
                    "terminal": terminal,
                    "remote_host": remote_host,
                    "login_at": login_at,
                },
                on_conflict="server_id,username,terminal,login_at",
            )
            logger.info("SSH login: %s from %s", username, remote_host or "local")

    # Ended sessions: present before but not now
    for key, login_at in _prev_ssh_sessions.items():
        if key not in current:
            username, terminal, remote_host = key
            supabase_patch(
                "ssh_session_history",
                {
                    "server_id": "eq." + SERVER_ID,
                    "username": "eq." + username,
                    "terminal": "eq." + terminal,
                    "login_at": "eq." + login_at,
                    "logout_at": "is.null",
                },
                {"logout_at": ts},
            )
            logger.info("SSH logout: %s", username)

    _prev_ssh_sessions = current


# ---------------------------------------------------------------------------
# Snapshot tables: delete-then-insert
# ---------------------------------------------------------------------------


def _replace_snapshot(table, rows):
    """Delete existing rows for this server and insert new snapshot."""
    if rows:
        supabase_delete(table, {"server_id": "eq." + SERVER_ID})
        supabase_post(table, rows)
    else:
        # Even if empty, clean up stale rows
        supabase_delete(table, {"server_id": "eq." + SERVER_ID})


# ---------------------------------------------------------------------------
# Main collection cycle
# ---------------------------------------------------------------------------


def run_collection_cycle():
    """Execute one full collection cycle."""
    logger.info("Starting collection cycle.")
    start = time.time()

    # ---- CPU / Memory (time-series) ----
    try:
        metrics = collect_server_metrics()
        supabase_post("server_metrics", metrics)
    except Exception as exc:
        logger.error("server_metrics collection failed: %s", exc)

    # ---- GPU metrics (time-series) ----
    try:
        gpu_rows = collect_gpu_metrics()
        if gpu_rows:
            supabase_post("gpu_metrics", gpu_rows)
    except Exception as exc:
        logger.error("gpu_metrics collection failed: %s", exc)

    # ---- GPU processes (snapshot) + usage log ----
    try:
        gpu_procs = collect_gpu_processes()
        _replace_snapshot("gpu_processes", gpu_procs)
        log_gpu_usage(gpu_procs)
    except Exception as exc:
        logger.error("gpu_processes collection failed: %s", exc)

    # ---- Disk partitions (time-series) ----
    try:
        disk_rows = collect_disk_partitions()
        if disk_rows:
            supabase_post("disk_partitions", disk_rows)
    except Exception as exc:
        logger.error("disk_partitions collection failed: %s", exc)

    # ---- SSH sessions (snapshot) + history tracking ----
    try:
        ssh_rows = collect_ssh_sessions()
        _replace_snapshot("ssh_sessions", ssh_rows)
        update_ssh_session_history(ssh_rows)
    except Exception as exc:
        logger.error("ssh_sessions collection failed: %s", exc)

    # ---- Disk usage per user (daily, time-series) ----
    try:
        usage_rows = collect_disk_usage_users()
        if usage_rows:
            supabase_post("disk_usage_users", usage_rows)
    except Exception as exc:
        logger.error("disk_usage_users collection failed: %s", exc)

    elapsed = round(time.time() - start, 2)
    logger.info("Collection cycle completed in %ss.", elapsed)


# ---------------------------------------------------------------------------
# Startup validation
# ---------------------------------------------------------------------------


def validate_config():
    """Ensure required environment variables are set and sane."""
    errors = []
    if not SUPABASE_URL:
        errors.append("SUPABASE_URL is not set.")
    elif not SUPABASE_URL.startswith("https://"):
        errors.append("SUPABASE_URL must use HTTPS to protect the service role key.")
    if not SUPABASE_KEY:
        errors.append("SUPABASE_SERVICE_ROLE_KEY is not set.")
    elif SUPABASE_KEY.count(".") != 2:
        errors.append("SUPABASE_SERVICE_ROLE_KEY does not look like a valid JWT (expected 3 segments).")
    if not SERVER_ID:
        errors.append("SERVER_ID is not set.")
    if COLLECTION_INTERVAL < 10:
        errors.append("COLLECTION_INTERVAL must be at least 10 seconds (got %d)." % COLLECTION_INTERVAL)
    if DISK_USAGE_INTERVAL < 3600:
        errors.append("DISK_USAGE_INTERVAL must be at least 3600 seconds (got %d)." % DISK_USAGE_INTERVAL)
    if errors:
        for e in errors:
            logger.error(e)
        logger.error("Set the required environment variables and restart.")
        sys.exit(1)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


def main():
    """Run the monitoring agent loop."""
    validate_config()

    logger.info("SD Lab Monitor Agent starting.")
    logger.info("  Supabase URL : %s", SUPABASE_URL)
    logger.info("  Server ID    : %s", SERVER_ID)
    logger.info("  Interval     : %ds", COLLECTION_INTERVAL)
    logger.info("  Disk paths   : %s", ", ".join(DISK_USAGE_PATHS))
    logger.info("  Disk interval: %ds", DISK_USAGE_INTERVAL)

    # Initialise SSH session diff state from DB to handle restarts gracefully
    _init_ssh_session_state()

    while True:
        try:
            run_collection_cycle()
        except Exception as exc:
            logger.error("Unexpected error in collection cycle: %s", exc)

        try:
            time.sleep(COLLECTION_INTERVAL)
        except KeyboardInterrupt:
            logger.info("Interrupted. Shutting down.")
            break

    logger.info("SD Lab Monitor Agent stopped.")


if __name__ == "__main__":
    main()
