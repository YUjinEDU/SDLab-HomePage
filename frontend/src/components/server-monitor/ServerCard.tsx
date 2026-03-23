import type { ServerMonitorData } from "@/types/server-monitor";
import { timeAgo } from "@/lib/utils/format";
import { GpuStatusSection } from "./GpuStatusSection";
import { SystemStatusSection } from "./SystemStatusSection";
import { DiskStatusSection } from "./DiskStatusSection";
import { ActiveUsersSection } from "./ActiveUsersSection";

type ServerCardProps = {
  data: ServerMonitorData;
};

function isOnline(recordedAt: string | undefined): boolean {
  if (!recordedAt) return false;
  const diff = Date.now() - new Date(recordedAt).getTime();
  return diff < 3 * 60 * 1000; // 3 minutes
}

export function ServerCard({ data }: ServerCardProps) {
  const {
    server,
    metrics,
    gpus,
    gpuProcesses,
    diskPartitions,
    diskUsageByUser,
    sshSessions,
  } = data;
  const online = isOnline(metrics?.recorded_at);
  const lastSeen = metrics?.recorded_at
    ? timeAgo(new Date(metrics.recorded_at))
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Server header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-gray-900">
              {server.name}
            </h2>
            <span className="text-xs text-gray-400 font-mono">
              {server.ip_address}
            </span>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              online
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-gray-100 text-gray-500 border border-gray-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                online
                  ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                  : "bg-gray-400"
              }`}
            />
            {online ? "온라인" : "오프라인"}
          </span>
        </div>
        {lastSeen && (
          <p className="text-xs text-gray-400 mt-1">마지막 수집: {lastSeen}</p>
        )}
      </div>

      {!online && !metrics ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-gray-400">수집된 데이터가 없습니다</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {/* GPU Section */}
          {gpus.length > 0 && (
            <GpuStatusSection gpus={gpus} processes={gpuProcesses} />
          )}

          {/* System Section */}
          {metrics && <SystemStatusSection metrics={metrics} />}

          {/* Disk Section */}
          {diskPartitions.length > 0 && (
            <DiskStatusSection
              partitions={diskPartitions}
              userUsage={diskUsageByUser}
            />
          )}

          {/* Active Users Section */}
          <ActiveUsersSection sessions={sshSessions} />
        </div>
      )}
    </div>
  );
}
