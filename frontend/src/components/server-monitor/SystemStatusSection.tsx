import type { ServerMetrics } from "@/types/server-monitor";
import { formatBytes, getStatusColor } from "@/lib/utils/format";

type SystemStatusSectionProps = {
  metrics: ServerMetrics;
};

function UsageBar({
  percent,
  label,
  detail,
}: {
  percent: number;
  label: string;
  detail?: string;
}) {
  const color = getStatusColor(percent);
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span className={color.text}>
          {Math.round(percent)}%{detail && ` (${detail})`}
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

function MiniCoreBar({ percent }: { percent: number }) {
  const color = getStatusColor(percent);
  return (
    <div
      className="h-4 w-2 bg-gray-100 rounded-sm overflow-hidden flex flex-col justify-end"
      title={`${Math.round(percent)}%`}
    >
      <div
        className={`w-full rounded-sm ${color.bar}`}
        style={{ height: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

export function SystemStatusSection({ metrics }: SystemStatusSectionProps) {
  const memPercent = metrics.memory_percent;

  return (
    <div className="px-5 py-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        시스템
      </h3>
      <div className="space-y-3">
        {/* CPU */}
        <UsageBar percent={metrics.cpu_percent} label="CPU" />

        {/* Per-core mini bars */}
        {metrics.cpu_per_core && metrics.cpu_per_core.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-1">코어별 사용률</p>
            <div className="flex gap-0.5 flex-wrap">
              {metrics.cpu_per_core.map((core, idx) => (
                <MiniCoreBar key={idx} percent={core} />
              ))}
            </div>
          </div>
        )}

        {/* Memory */}
        <UsageBar
          percent={memPercent}
          label="RAM"
          detail={`${formatBytes(metrics.memory_used_bytes)} / ${formatBytes(metrics.memory_total_bytes)}`}
        />

        {/* Load average */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="text-gray-400">Load Average</span>
          <span>{metrics.load_avg_1m.toFixed(2)}</span>
          <span>{metrics.load_avg_5m.toFixed(2)}</span>
          <span>{metrics.load_avg_15m.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
