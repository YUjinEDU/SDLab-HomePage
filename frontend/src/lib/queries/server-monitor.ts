import { db } from "@/lib/db/drizzle";
import {
  servers,
  serverMetrics,
  gpuMetrics,
  gpuProcesses,
  diskPartitions,
  diskUsageUsers,
  sshSessions,
  sshSessionHistory,
  gpuUsageLog,
} from "@/lib/db/schema";
import { eq, desc, asc, gte, lt, and } from "drizzle-orm";
import type {
  Server,
  ServerMetrics,
  GpuMetrics,
  GpuProcess,
  DiskPartition,
  DiskUsageUser,
  SshSession,
  ServerMonitorData,
  SshSessionHistory,
  GpuUsageLog,
  GpuUserRanking,
} from "@/types/server-monitor";

// ---------------------------------------------------------------------------
// Adapters: map Drizzle rows to the existing TypeScript types
// ---------------------------------------------------------------------------

function toServer(row: typeof servers.$inferSelect): Server {
  return {
    id: String(row.id),
    name: row.name,
    hostname: row.host,
    ip_address: row.host,
    description: null,
    gpu_models: null,
    storage_paths: null,
    is_active: row.isOnline ?? false,
    created_at: row.updatedAt?.toISOString() ?? new Date().toISOString(),
    updated_at: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

function toServerMetrics(row: typeof serverMetrics.$inferSelect): ServerMetrics {
  return {
    id: String(row.id),
    server_id: String(row.serverId),
    cpu_percent: row.cpuUsage ?? 0,
    cpu_per_core: [],
    memory_total_bytes: row.memoryTotal ?? 0,
    memory_used_bytes: row.memoryUsed ?? 0,
    memory_percent:
      row.memoryTotal && row.memoryTotal > 0
        ? ((row.memoryUsed ?? 0) / row.memoryTotal) * 100
        : 0,
    load_avg_1m: 0,
    load_avg_5m: 0,
    load_avg_15m: 0,
    recorded_at: row.recordedAt?.toISOString() ?? new Date().toISOString(),
  };
}

function toGpuMetrics(row: typeof gpuMetrics.$inferSelect): GpuMetrics {
  return {
    id: String(row.id),
    server_id: String(row.serverId),
    gpu_index: row.gpuIndex,
    gpu_name: row.gpuName ?? "",
    gpu_util_percent: row.utilizationGpu ?? 0,
    memory_total_mb: row.memoryTotal ?? 0,
    memory_used_mb: row.memoryUsed ?? 0,
    memory_percent:
      row.memoryTotal && row.memoryTotal > 0
        ? ((row.memoryUsed ?? 0) / row.memoryTotal) * 100
        : 0,
    temperature_c: row.temperatureGpu ?? 0,
    power_draw_w: 0,
    power_limit_w: 0,
    fan_speed_percent: 0,
    recorded_at: row.recordedAt?.toISOString() ?? new Date().toISOString(),
  };
}

function toGpuProcess(row: typeof gpuProcesses.$inferSelect): GpuProcess {
  return {
    id: String(row.id),
    server_id: String(row.serverId),
    gpu_index: row.gpuIndex,
    pid: row.pid ?? 0,
    username: row.username ?? "",
    process_name: row.processName ?? "",
    gpu_memory_used_mb: row.usedMemory ?? 0,
    cpu_percent: 0,
    command: row.processName ?? "",
    started_at: null,
    recorded_at: row.recordedAt?.toISOString() ?? new Date().toISOString(),
  };
}

function toDiskPartition(row: typeof diskPartitions.$inferSelect): DiskPartition {
  return {
    id: String(row.id),
    server_id: String(row.serverId),
    device: row.device ?? "",
    mount_point: row.mountpoint ?? "",
    fs_type: "",
    total_bytes: row.total ?? 0,
    used_bytes: row.used ?? 0,
    free_bytes: (row.total ?? 0) - (row.used ?? 0),
    percent:
      row.total && row.total > 0 ? ((row.used ?? 0) / row.total) * 100 : 0,
    recorded_at: row.recordedAt?.toISOString() ?? new Date().toISOString(),
  };
}

function toDiskUsageUser(row: typeof diskUsageUsers.$inferSelect): DiskUsageUser {
  return {
    id: String(row.id),
    server_id: String(row.serverId),
    base_path: "",
    username: row.username ?? "",
    bytes_used: row.usageBytes ?? 0,
    recorded_at: row.recordedAt?.toISOString() ?? new Date().toISOString(),
  };
}

function toSshSession(row: typeof sshSessions.$inferSelect): SshSession {
  return {
    id: String(row.id),
    server_id: String(row.serverId),
    username: row.username ?? "",
    terminal: "",
    remote_host: row.fromHost ?? "",
    login_at: row.loginAt?.toISOString() ?? new Date().toISOString(),
    recorded_at: row.loginAt?.toISOString() ?? new Date().toISOString(),
  };
}

function toSshSessionHistory(
  row: typeof sshSessionHistory.$inferSelect,
): SshSessionHistory {
  return {
    id: row.id,
    server_id: String(row.serverId),
    username: row.username ?? "",
    terminal: "",
    remote_host: row.fromHost ?? "",
    login_at: row.loginAt?.toISOString() ?? new Date().toISOString(),
    logout_at: row.logoutAt?.toISOString() ?? null,
    created_at: row.loginAt?.toISOString() ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Query functions — identical signatures to the original
// ---------------------------------------------------------------------------

export async function getServers(): Promise<Server[]> {
  const rows = await db
    .select()
    .from(servers)
    .where(eq(servers.isOnline, true))
    .orderBy(asc(servers.name));
  return rows.map(toServer);
}

export async function getLatestServerMetrics(
  serverId: string,
): Promise<ServerMetrics | null> {
  const [row] = await db
    .select()
    .from(serverMetrics)
    .where(eq(serverMetrics.serverId, Number(serverId)))
    .orderBy(desc(serverMetrics.recordedAt))
    .limit(1);
  return row ? toServerMetrics(row) : null;
}

export async function getLatestGpuMetrics(
  serverId: string,
): Promise<GpuMetrics[]> {
  const rows = await db
    .select()
    .from(gpuMetrics)
    .where(eq(gpuMetrics.serverId, Number(serverId)))
    .orderBy(desc(gpuMetrics.recordedAt))
    .limit(20);

  if (!rows.length) return [];

  const latest = rows[0].recordedAt?.toISOString();
  return rows
    .filter((r) => r.recordedAt?.toISOString() === latest)
    .sort((a, b) => a.gpuIndex - b.gpuIndex)
    .map(toGpuMetrics);
}

export async function getGpuProcesses(serverId: string): Promise<GpuProcess[]> {
  const rows = await db
    .select()
    .from(gpuProcesses)
    .where(eq(gpuProcesses.serverId, Number(serverId)))
    .orderBy(asc(gpuProcesses.gpuIndex), desc(gpuProcesses.usedMemory));
  return rows.map(toGpuProcess);
}

export async function getLatestDiskPartitions(
  serverId: string,
): Promise<DiskPartition[]> {
  const rows = await db
    .select()
    .from(diskPartitions)
    .where(eq(diskPartitions.serverId, Number(serverId)))
    .orderBy(desc(diskPartitions.recordedAt))
    .limit(50);

  if (!rows.length) return [];

  const latest = rows[0].recordedAt?.toISOString();
  return rows
    .filter((r) => r.recordedAt?.toISOString() === latest)
    .sort((a, b) => (a.mountpoint ?? "").localeCompare(b.mountpoint ?? ""))
    .map(toDiskPartition);
}

export async function getDiskUsageByUser(
  serverId: string,
): Promise<DiskUsageUser[]> {
  const rows = await db
    .select()
    .from(diskUsageUsers)
    .where(eq(diskUsageUsers.serverId, Number(serverId)))
    .orderBy(desc(diskUsageUsers.recordedAt))
    .limit(100);

  if (!rows.length) return [];

  const latest = rows[0].recordedAt?.toISOString();
  return rows
    .filter((r) => r.recordedAt?.toISOString() === latest)
    .sort((a, b) => (b.usageBytes ?? 0) - (a.usageBytes ?? 0))
    .map(toDiskUsageUser);
}

export async function getSshSessions(serverId: string): Promise<SshSession[]> {
  const rows = await db
    .select()
    .from(sshSessions)
    .where(eq(sshSessions.serverId, Number(serverId)))
    .orderBy(desc(sshSessions.loginAt))
    .limit(200);
  return rows.map(toSshSession);
}

// ---------------------------------------------------------------------------
// Usage history queries (admin-only analytics)
// ---------------------------------------------------------------------------

type UsagePeriod = "week" | "month" | "prev_month";

function getPeriodBounds(period: UsagePeriod): {
  since: Date;
  until?: Date;
} {
  const now = new Date();
  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return { since: d };
  }
  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { since: start };
  }
  // prev_month
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  return { since: start, until: end };
}

export async function getGpuUsageRanking(
  period: UsagePeriod,
  serverId?: string,
): Promise<GpuUserRanking[]> {
  const { since, until } = getPeriodBounds(period);

  const conditions = [gte(gpuUsageLog.recordedAt, since)];
  if (until) conditions.push(lt(gpuUsageLog.recordedAt, until));
  if (serverId) conditions.push(eq(gpuUsageLog.serverId, Number(serverId)));

  const rows = await db
    .select({
      username: gpuUsageLog.username,
      serverId: gpuUsageLog.serverId,
      usedMemory: gpuUsageLog.usedMemory,
    })
    .from(gpuUsageLog)
    .where(and(...(conditions as [typeof conditions[0], ...typeof conditions])))
    .limit(50000);

  if (!rows.length) return [];

  const allServers = await getServers();
  const serverMap = new Map(allServers.map((s) => [s.id, s.name]));

  const agg = new Map<
    string,
    { minutes: number; maxMemory: number; sid: string }
  >();
  for (const row of rows) {
    const sid = String(row.serverId);
    const key = `${sid}:${row.username}`;
    const existing = agg.get(key);
    const mem = row.usedMemory ?? 0;
    if (existing) {
      existing.minutes += 1;
      if (mem > existing.maxMemory) existing.maxMemory = mem;
    } else {
      agg.set(key, { minutes: 1, maxMemory: mem, sid });
    }
  }

  return Array.from(agg.entries())
    .map(([key, val]) => ({
      username: key.split(":")[1],
      server_id: val.sid,
      server_name: serverMap.get(val.sid) ?? val.sid,
      minutes_used: val.minutes,
      max_memory_mb: val.maxMemory,
    }))
    .sort((a, b) => b.minutes_used - a.minutes_used);
}

export async function getSshSessionHistory(
  serverId?: string,
  limit = 200,
): Promise<(SshSessionHistory & { server_name: string })[]> {
  const conditions = serverId
    ? [eq(sshSessionHistory.serverId, Number(serverId))]
    : [];

  const rows = await db
    .select()
    .from(sshSessionHistory)
    .where(conditions.length ? conditions[0] : undefined)
    .orderBy(desc(sshSessionHistory.loginAt))
    .limit(limit);

  const allServers = await getServers();
  const serverMap = new Map(allServers.map((s) => [s.id, s.name]));

  return rows.map((row) => ({
    ...toSshSessionHistory(row),
    server_name: serverMap.get(String(row.serverId)) ?? String(row.serverId),
  }));
}

export async function getServerMonitorData(): Promise<ServerMonitorData[]> {
  const allServers = await getServers();

  const results = await Promise.all(
    allServers.map(async (server) => {
      const [
        metrics,
        gpus,
        gpuProcs,
        diskParts,
        diskUsageByUser,
        sshSess,
      ] = await Promise.all([
        getLatestServerMetrics(server.id),
        getLatestGpuMetrics(server.id),
        getGpuProcesses(server.id),
        getLatestDiskPartitions(server.id),
        getDiskUsageByUser(server.id),
        getSshSessions(server.id),
      ]);

      return {
        server,
        metrics,
        gpus,
        gpuProcesses: gpuProcs,
        diskPartitions: diskParts,
        diskUsageByUser,
        sshSessions: sshSess,
      };
    }),
  );

  return results;
}
