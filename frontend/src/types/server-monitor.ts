export type Server = {
  id: string;
  name: string;
  hostname: string;
  ip_address: string;
  description: string | null;
  gpu_models: string[] | null;
  storage_paths: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ServerMetrics = {
  id: string;
  server_id: string;
  cpu_percent: number;
  cpu_per_core: number[];
  memory_total_bytes: number;
  memory_used_bytes: number;
  memory_percent: number;
  load_avg_1m: number;
  load_avg_5m: number;
  load_avg_15m: number;
  recorded_at: string;
};

export type GpuMetrics = {
  id: string;
  server_id: string;
  gpu_index: number;
  gpu_name: string;
  gpu_util_percent: number;
  memory_total_mb: number;
  memory_used_mb: number;
  memory_percent: number;
  temperature_c: number;
  power_draw_w: number;
  power_limit_w: number;
  fan_speed_percent: number;
  recorded_at: string;
};

export type GpuProcess = {
  id: string;
  server_id: string;
  gpu_index: number;
  pid: number;
  username: string;
  process_name: string;
  gpu_memory_used_mb: number;
  cpu_percent: number;
  command: string;
  started_at: string | null;
  recorded_at: string;
};

export type DiskPartition = {
  id: string;
  server_id: string;
  device: string;
  mount_point: string;
  fs_type: string;
  total_bytes: number;
  used_bytes: number;
  free_bytes: number;
  percent: number;
  recorded_at: string;
};

export type DiskUsageUser = {
  id: string;
  server_id: string;
  base_path: string;
  username: string;
  bytes_used: number;
  recorded_at: string;
};

export type SshSession = {
  id: string;
  server_id: string;
  username: string;
  terminal: string;
  remote_host: string;
  login_at: string;
  recorded_at: string;
};

export type ServerMonitorData = {
  server: Server;
  metrics: ServerMetrics | null;
  gpus: GpuMetrics[];
  gpuProcesses: GpuProcess[];
  diskPartitions: DiskPartition[];
  diskUsageByUser: DiskUsageUser[];
  sshSessions: SshSession[];
};
