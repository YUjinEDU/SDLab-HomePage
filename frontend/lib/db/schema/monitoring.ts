import {
  pgTable, serial, text, integer, boolean,
  timestamp, real
} from "drizzle-orm/pg-core";

export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  host: text("host").notNull(),
  isOnline: boolean("is_online").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serverMetrics = pgTable("server_metrics", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id").notNull().references(() => servers.id),
  cpuUsage: real("cpu_usage"),
  memoryUsed: real("memory_used"),
  memoryTotal: real("memory_total"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const gpuMetrics = pgTable("gpu_metrics", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id").notNull().references(() => servers.id),
  gpuIndex: integer("gpu_index").notNull(),
  gpuName: text("gpu_name"),
  utilizationGpu: real("utilization_gpu"),
  memoryUsed: real("memory_used"),
  memoryTotal: real("memory_total"),
  temperatureGpu: real("temperature_gpu"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const gpuProcesses = pgTable("gpu_processes", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id").notNull().references(() => servers.id),
  gpuIndex: integer("gpu_index").notNull(),
  pid: integer("pid"),
  processName: text("process_name"),
  usedMemory: real("used_memory"),
  username: text("username"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const diskPartitions = pgTable("disk_partitions", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id").notNull().references(() => servers.id),
  device: text("device"),
  mountpoint: text("mountpoint"),
  total: real("total"),
  used: real("used"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const diskUsageUsers = pgTable("disk_usage_users", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id").notNull().references(() => servers.id),
  username: text("username"),
  usageBytes: real("usage_bytes"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const sshSessions = pgTable("ssh_sessions", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id").notNull().references(() => servers.id),
  username: text("username"),
  fromHost: text("from_host"),
  loginAt: timestamp("login_at"),
});

export const sshSessionHistory = pgTable("ssh_session_history", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id").notNull().references(() => servers.id),
  username: text("username"),
  fromHost: text("from_host"),
  loginAt: timestamp("login_at"),
  logoutAt: timestamp("logout_at"),
});

export const gpuUsageLog = pgTable("gpu_usage_log", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id").notNull().references(() => servers.id),
  username: text("username"),
  gpuIndex: integer("gpu_index"),
  usedMemory: real("used_memory"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});
