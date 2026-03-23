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

export function DiskStatusSection({
  partitions,
  userUsage,
}: DiskStatusSectionProps) {
  // Group user usage by mount point
  const usersByMount = new Map<string, DiskUsageUser[]>();
  for (const u of userUsage) {
    const list = usersByMount.get(u.base_path) ?? [];
    list.push(u);
    usersByMount.set(u.base_path, list);
  }

  // Build a map of partition total bytes by mount point
  const totalByMount = new Map<string, number>();
  for (const p of partitions) {
    totalByMount.set(p.mount_point, p.total_bytes);
  }

  return (
    <div className="px-5 py-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        디스크
      </h3>
      <div className="space-y-2">
        {partitions.map((partition) => (
          <div key={partition.mount_point}>
            <PartitionBar partition={partition} />
            <UserUsageTable
              mountPoint={partition.mount_point}
              users={usersByMount.get(partition.mount_point) ?? []}
              totalBytes={totalByMount.get(partition.mount_point) ?? 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
