import Link from "next/link";
import {
  getGpuUsageRanking,
  getSshSessionHistory,
  getServers,
} from "@/lib/queries/server-monitor";
import type { GpuUserRanking, SshSessionHistory } from "@/types/server-monitor";

type UsagePeriod = "week" | "month" | "prev_month";
type UsageTab = "gpu" | "ssh";

const PERIOD_LABELS: Record<UsagePeriod, string> = {
  week: "최근 7일",
  month: "이번 달",
  prev_month: "전달",
};

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
}

function formatMemoryGb(mb: number): string {
  if (mb === 0) return "-";
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDuration(loginAt: string, logoutAt: string | null): string {
  const start = new Date(loginAt).getTime();
  const end = logoutAt ? new Date(logoutAt).getTime() : Date.now();
  const minutes = Math.round((end - start) / 60000);
  return formatMinutes(minutes);
}

// ---------------------------------------------------------------------------
// GPU Ranking Tab
// ---------------------------------------------------------------------------

function GpuRankingTable({ rankings }: { rankings: GpuUserRanking[] }) {
  if (rankings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        해당 기간에 GPU 사용 기록이 없습니다.
        <br />
        <span className="text-xs mt-1 block text-gray-300">
          에이전트 업데이트 후 첫 수집부터 기록됩니다.
        </span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
              순위
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              사용자
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              서버
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              GPU 사용 시간
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              최대 메모리
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rankings.map((row, idx) => (
            <tr
              key={`${row.server_id}:${row.username}`}
              className="hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-gray-400 font-mono text-xs">
                {idx + 1}
              </td>
              <td className="py-3 px-4 font-medium text-gray-900">
                {row.username}
              </td>
              <td className="py-3 px-4 text-gray-500 text-xs">
                {row.server_name}
              </td>
              <td className="py-3 px-4 text-right font-mono text-emerald-700 font-medium">
                {formatMinutes(row.minutes_used)}
              </td>
              <td className="py-3 px-4 text-right text-gray-500 font-mono text-xs">
                {formatMemoryGb(row.max_memory_mb)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SSH History Tab
// ---------------------------------------------------------------------------

function SshHistoryTable({
  sessions,
}: {
  sessions: (SshSessionHistory & { server_name: string })[];
}) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        SSH 접속 기록이 없습니다.
        <br />
        <span className="text-xs mt-1 block text-gray-300">
          에이전트 업데이트 후 첫 접속부터 기록됩니다.
        </span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              사용자
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              서버
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              접속 시간
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              종료 시간
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              접속 시간
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              IP
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sessions.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-900">
                {s.username}
              </td>
              <td className="py-3 px-4 text-gray-500 text-xs">
                {s.server_name}
              </td>
              <td className="py-3 px-4 text-gray-600 text-xs font-mono">
                {formatDateTime(s.login_at)}
              </td>
              <td className="py-3 px-4 text-xs">
                {s.logout_at ? (
                  <span className="text-gray-600 font-mono">
                    {formatDateTime(s.logout_at)}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    접속 중
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-right text-gray-500 font-mono text-xs">
                {formatDuration(s.login_at, s.logout_at)}
              </td>
              <td className="py-3 px-4 text-gray-400 text-xs font-mono">
                {s.remote_host || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function UsagePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; period?: string; server?: string }>;
}) {
  const params = await searchParams;

  const tab: UsageTab = params.tab === "ssh" ? "ssh" : "gpu";
  const period: UsagePeriod =
    params.period === "month" || params.period === "prev_month"
      ? params.period
      : "week";
  const serverId = params.server;

  const servers = await getServers();

  const [gpuRanking, sshSessions] = await Promise.all([
    tab === "gpu"
      ? getGpuUsageRanking(period, serverId)
      : Promise.resolve<GpuUserRanking[]>([]),
    tab === "ssh"
      ? getSshSessionHistory(serverId)
      : Promise.resolve<(SshSessionHistory & { server_name: string })[]>([]),
  ]);

  // URL helpers
  function tabUrl(t: UsageTab) {
    const p = new URLSearchParams({
      tab: t,
      period,
      ...(serverId ? { server: serverId } : {}),
    });
    return `/professor/usage?${p}`;
  }
  function periodUrl(p: UsagePeriod) {
    const ps = new URLSearchParams({
      tab,
      period: p,
      ...(serverId ? { server: serverId } : {}),
    });
    return `/professor/usage?${ps}`;
  }
  function serverUrl(sid: string | undefined) {
    const p = new URLSearchParams({
      tab,
      period,
      ...(sid ? { server: sid } : {}),
    });
    return `/professor/usage?${p}`;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">사용 이력 분석</h1>
        <p className="text-sm text-gray-500 mt-1">
          SSH 접속 이력 및 GPU 사용 현황 (관리자 전용)
        </p>
      </div>

      {/* Tab */}
      <div className="flex gap-1 border-b border-gray-200">
        {(["gpu", "ssh"] as UsageTab[]).map((t) => (
          <Link
            key={t}
            href={tabUrl(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "gpu" ? "GPU 사용 랭킹" : "SSH 접속 이력"}
          </Link>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        {/* Period filter (GPU only) */}
        {tab === "gpu" && (
          <div className="flex gap-1">
            {(["week", "month", "prev_month"] as UsagePeriod[]).map((p) => (
              <Link
                key={p}
                href={periodUrl(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  period === p
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {PERIOD_LABELS[p]}
              </Link>
            ))}
          </div>
        )}
        {tab === "ssh" && <div />}

        {/* Server filter */}
        <div className="flex gap-1">
          <Link
            href={serverUrl(undefined)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !serverId
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            전체 서버
          </Link>
          {servers.map((s) => (
            <Link
              key={s.id}
              href={serverUrl(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                serverId === s.id
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {tab === "gpu" ? (
          <GpuRankingTable rankings={gpuRanking} />
        ) : (
          <SshHistoryTable sessions={sshSessions} />
        )}
      </div>
    </div>
  );
}
