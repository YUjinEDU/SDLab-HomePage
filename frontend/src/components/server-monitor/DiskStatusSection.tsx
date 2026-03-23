import type { DiskPartition, DiskUsageUser } from "@/types/server-monitor";
import { formatBytes, getStatusColor } from "@/lib/utils/format";

type DiskStatusSectionProps = {
  partitions: DiskPartition[];
  userUsage: DiskUsageUser[];
};

function PartitionBar({ partition }: { partition: DiskPartition }) {
  const percent = partition.percent;
  const color = getStatusColor(percent);

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span className="font-mono">{partition.mount_point}</span>
        <span className={color.text}>
          {Math.round(percent)}% ({formatBytes(partition.used_bytes)} /{" "}
          {formatBytes(partition.total_bytes)})
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color.bar}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

function UserUsageTable({
  mountPoint,
  users,
  totalBytes,
}: {
  mountPoint: string;
  users: DiskUsageUser[];
  totalBytes: number;
}) {
  if (users.length === 0) return null;

  return (
    <div className="mt-2">
      <p className="text-xs text-gray-400 mb-1">유저별 사용량 ({mountPoint})</p>
      <div className="space-y-1">
        {users.map((user) => {
          const percent =
            totalBytes > 0 ? (user.bytes_used / totalBytes) * 100 : 0;
          const color = getStatusColor(percent);
          return (
            <div key={user.username} className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 w-20 shrink-0 truncate">
                {user.username}
              </span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color.bar}`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 shrink-0 w-24 text-right">
                {formatBytes(user.bytes_used)} ({Math.round(percent)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const VISIBLE_MOUNTS = [
  "/",
  "/home",
  "/mnt/hdd1",
  "/mnt/hdd2",
  "/mnt/hdd3",
  "/mnt/ssd1",
  "/data",
];

function isVisiblePartition(mountPoint: string): boolean {
  return VISIBLE_MOUNTS.some(
    (vm) =>
      mountPoint === vm || (vm !== "/" && mountPoint.startsWith(vm + "/")),
  );
}

export function DiskStatusSection({
  partitions,
  userUsage,
}: DiskStatusSectionProps) {
  const visiblePartitions = partitions.filter((p) =>
    isVisiblePartition(p.mount_point),
  );

  // Group user usage by base_path (e.g. /home, /mnt/hdd1, /mnt/hdd2)
  const usersByBasePath = new Map<string, DiskUsageUser[]>();
  for (const u of userUsage) {
    const list = usersByBasePath.get(u.base_path) ?? [];
    list.push(u);
    usersByBasePath.set(u.base_path, list);
  }

  // Find the best matching partition for a base_path to get totalBytes
  // e.g. /home → matches / partition, /mnt/hdd1 → matches /mnt/hdd1 partition
  function findTotalBytes(basePath: string): number {
    // Exact match first
    const exact = partitions.find((p) => p.mount_point === basePath);
    if (exact) return exact.total_bytes;
    // Find longest matching parent mount
    let best: DiskPartition | null = null;
    for (const p of partitions) {
      if (
        basePath.startsWith(p.mount_point) &&
        (!best || p.mount_point.length > best.mount_point.length)
      ) {
        best = p;
      }
    }
    return best?.total_bytes ?? 0;
  }

  // Collect base_paths that are already shown as partitions (to avoid duplicate user tables)
  const shownUserPaths = new Set<string>();

  return (
    <div className="px-5 py-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        디스크
      </h3>
      <div className="space-y-2">
        {/* Partition bars + inline user tables for matching base_paths */}
        {visiblePartitions.map((partition) => {
          const users = usersByBasePath.get(partition.mount_point) ?? [];
          if (users.length > 0) shownUserPaths.add(partition.mount_point);
          return (
            <div key={partition.mount_point}>
              <PartitionBar partition={partition} />
              <UserUsageTable
                mountPoint={partition.mount_point}
                users={users}
                totalBytes={partition.total_bytes}
              />
            </div>
          );
        })}

        {/* Standalone user tables for base_paths without matching partitions (e.g. /home on root) */}
        {Array.from(usersByBasePath.entries())
          .filter(([basePath]) => !shownUserPaths.has(basePath))
          .map(([basePath, users]) => (
            <UserUsageTable
              key={basePath}
              mountPoint={basePath}
              users={users}
              totalBytes={findTotalBytes(basePath)}
            />
          ))}
      </div>
    </div>
  );
}
