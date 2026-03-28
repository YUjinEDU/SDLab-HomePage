import { createClient } from "@/lib/db/supabase-server";
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

export async function getServers(): Promise<Server[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("servers")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;
  return (data ?? []) as Server[];
}

export async function getLatestServerMetrics(
  serverId: string,
): Promise<ServerMetrics | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("server_metrics")
    .select("*")
    .eq("server_id", serverId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data as ServerMetrics | null;
}

export async function getLatestGpuMetrics(
  serverId: string,
): Promise<GpuMetrics[]> {
  const supabase = await createClient();

  // 단일 쿼리: 최근 20행 가져와서 클라이언트에서 latest batch만 필터 (2-step → 1-step)
  const { data, error } = await supabase
    .from("gpu_metrics")
    .select("*")
    .eq("server_id", serverId)
    .order("recorded_at", { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) return [];

  const latest = (data[0] as GpuMetrics).recorded_at;
  return (data as GpuMetrics[])
    .filter((r) => r.recorded_at === latest)
    .sort((a, b) => a.gpu_index - b.gpu_index);
}

export async function getGpuProcesses(serverId: string): Promise<GpuProcess[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gpu_processes")
    .select("*")
    .eq("server_id", serverId)
    .order("gpu_index")
    .order("gpu_memory_used_mb", { ascending: false });

  if (error) return [];
  return (data ?? []) as GpuProcess[];
}

export async function getLatestDiskPartitions(
  serverId: string,
): Promise<DiskPartition[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("disk_partitions")
    .select("*")
    .eq("server_id", serverId)
    .order("recorded_at", { ascending: false })
    .limit(50);

  if (error || !data || data.length === 0) return [];

  const latest = (data[0] as DiskPartition).recorded_at;
  return (data as DiskPartition[])
    .filter((r) => r.recorded_at === latest)
    .sort((a, b) => a.mount_point.localeCompare(b.mount_point));
}

export async function getDiskUsageByUser(
  serverId: string,
): Promise<DiskUsageUser[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("disk_usage_users")
    .select("*")
    .eq("server_id", serverId)
    .order("recorded_at", { ascending: false })
    .limit(100);

  if (error || !data || data.length === 0) return [];

  const latest = (data[0] as DiskUsageUser).recorded_at;
  return (data as DiskUsageUser[])
    .filter((r) => r.recorded_at === latest)
    .sort((a, b) => b.bytes_used - a.bytes_used);
}

export async function getSshSessions(serverId: string): Promise<SshSession[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ssh_sessions")
    .select("*")
    .eq("server_id", serverId)
    .order("login_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as SshSession[];
}

// ---------------------------------------------------------------------------
// Usage history queries (admin-only analytics)
// ---------------------------------------------------------------------------

type UsagePeriod = "week" | "month" | "prev_month";

function getPeriodBounds(period: UsagePeriod): {
  since: string;
  until?: string;
} {
  const now = new Date();
  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return { since: d.toISOString() };
  }
  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { since: start.toISOString() };
  }
  // prev_month
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  return { since: start.toISOString(), until: end.toISOString() };
}

export async function getGpuUsageRanking(
  period: UsagePeriod,
  serverId?: string,
): Promise<GpuUserRanking[]> {
  const supabase = await createClient();
  const { since, until } = getPeriodBounds(period);

  let query = supabase
    .from("gpu_usage_log")
    .select("username,server_id,memory_used_mb")
    .gte("recorded_at", since);

  if (until) query = query.lt("recorded_at", until);
  if (serverId) query = query.eq("server_id", serverId);

  const { data, error } = await query;
  if (error || !data) return [];

  const servers = await getServers();
  const serverMap = new Map(servers.map((s) => [s.id, s.name]));

  // Aggregate by (server_id, username): count minutes, track max memory
  const agg = new Map<
    string,
    { minutes: number; maxMemory: number; sid: string }
  >();
  for (const row of data as GpuUsageLog[]) {
    const key = `${row.server_id}:${row.username}`;
    const existing = agg.get(key);
    const mem = row.memory_used_mb ?? 0;
    if (existing) {
      existing.minutes += 1;
      if (mem > existing.maxMemory) existing.maxMemory = mem;
    } else {
      agg.set(key, { minutes: 1, maxMemory: mem, sid: row.server_id });
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
  const supabase = await createClient();

  let query = supabase
    .from("ssh_session_history")
    .select("*")
    .order("login_at", { ascending: false })
    .limit(limit);

  if (serverId) query = query.eq("server_id", serverId);

  const { data, error } = await query;
  if (error || !data) return [];

  const servers = await getServers();
  const serverMap = new Map(servers.map((s) => [s.id, s.name]));

  return (data as SshSessionHistory[]).map((row) => ({
    ...row,
    server_name: serverMap.get(row.server_id) ?? row.server_id,
  }));
}

export async function getServerMonitorData(): Promise<ServerMonitorData[]> {
  const servers = await getServers();

  const results = await Promise.all(
    servers.map(async (server) => {
      const [
        metrics,
        gpus,
        gpuProcesses,
        diskPartitions,
        diskUsageByUser,
        sshSessions,
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
        gpuProcesses,
        diskPartitions,
        diskUsageByUser,
        sshSessions,
      };
    }),
  );

  return results;
}
