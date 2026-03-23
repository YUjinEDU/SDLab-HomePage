import type { GpuMetrics, GpuProcess } from "@/types/server-monitor";
import {
  formatBytes,
  formatDuration,
  getStatusColor,
} from "@/lib/utils/format";

type GpuStatusSectionProps = {
  gpus: GpuMetrics[];
  processes: GpuProcess[];
};

function UsageBar({ percent, label }: { percent: number; label: string }) {
  const color = getStatusColor(percent);
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span className={color.text}>{Math.round(percent)}%</span>
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

function ProcessRow({ process }: { process: GpuProcess }) {
  const runningSince = process.started_at
    ? formatDuration(
        (Date.now() - new Date(process.started_at).getTime()) / 1000,
      )
    : "-";

  return (
    <div className="flex items-center justify-between text-xs py-1">
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-medium text-gray-700 shrink-0">
          {process.username}
        </span>
        <span className="text-gray-400 truncate">{process.process_name}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-2">
        <span className="text-gray-500">
          {formatBytes(process.gpu_memory_used_mb * 1024 * 1024)}
        </span>
        <span className="text-gray-400 w-16 text-right">{runningSince}</span>
      </div>
    </div>
  );
}

export function GpuStatusSection({ gpus, processes }: GpuStatusSectionProps) {
  return (
    <div className="px-5 py-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        GPU
      </h3>
      <div className="space-y-3">
        {gpus.map((gpu) => {
          const memPercent = gpu.memory_percent;
          const gpuProcesses = processes.filter(
            (p) => p.gpu_index === gpu.gpu_index,
          );

          return (
            <div
              key={gpu.gpu_index}
              className="border border-gray-100 rounded-lg p-3"
            >
              {/* GPU header */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">
                  {gpu.gpu_name}
                  <span className="text-gray-400 ml-1">#{gpu.gpu_index}</span>
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{gpu.temperature_c}°C</span>
                  <span>
                    {Math.round(gpu.power_draw_w)}W /{" "}
                    {Math.round(gpu.power_limit_w)}W
                  </span>
                </div>
              </div>

              {/* Usage bars */}
              <div className="space-y-2">
                <UsageBar percent={gpu.gpu_util_percent} label="사용률" />
                <UsageBar
                  percent={memPercent}
                  label={`메모리 ${formatBytes(gpu.memory_used_mb * 1024 * 1024)} / ${formatBytes(gpu.memory_total_mb * 1024 * 1024)}`}
                />
              </div>

              {/* Processes */}
              <div className="mt-2 pt-2 border-t border-gray-50">
                {gpuProcesses.length === 0 ? (
                  <p className="text-xs text-gray-300">프로세스 없음</p>
                ) : (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">프로세스:</p>
                    {gpuProcesses.map((proc) => (
                      <ProcessRow key={proc.id} process={proc} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
