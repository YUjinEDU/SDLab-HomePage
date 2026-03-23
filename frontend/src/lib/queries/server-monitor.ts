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

  const { data: latest, error: latestError } = await supabase
    .from("gpu_metrics")
    .select("recorded_at")
    .eq("server_id", serverId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError || !latest) return [];

  const { data, error } = await supabase
    .from("gpu_metrics")
    .select("*")
    .eq("server_id", serverId)
    .eq("recorded_at", latest.recorded_at)
    .order("gpu_index");

  if (error) return [];
  return (data ?? []) as GpuMetrics[];
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

  const { data: latest, error: latestError } = await supabase
    .from("disk_partitions")
    .select("recorded_at")
    .eq("server_id", serverId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError || !latest) return [];

  const { data, error } = await supabase
    .from("disk_partitions")
    .select("*")
    .eq("server_id", serverId)
    .eq("recorded_at", latest.recorded_at)
    .order("mount_point");

  if (error) return [];
  return (data ?? []) as DiskPartition[];
}

export async function getDiskUsageByUser(
  serverId: string,
): Promise<DiskUsageUser[]> {
  const supabase = await createClient();

  const { data: latest, error: latestError } = await supabase
    .from("disk_usage_users")
    .select("recorded_at")
    .eq("server_id", serverId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError || !latest) return [];

  const { data, error } = await supabase
    .from("disk_usage_users")
    .select("*")
    .eq("server_id", serverId)
    .eq("recorded_at", latest.recorded_at)
    .order("bytes_used", { ascending: false });

  if (error) return [];
  return (data ?? []) as DiskUsageUser[];
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
