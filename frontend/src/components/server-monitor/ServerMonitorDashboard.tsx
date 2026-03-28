"use client";

import { useState, useEffect, useCallback } from "react";
import type { ServerMonitorData } from "@/types/server-monitor";
import { ServerCard } from "./ServerCard";
import { timeAgo } from "@/lib/utils/format";

type ServerMonitorDashboardProps = {
  initialData?: ServerMonitorData[];
};

export function ServerMonitorDashboard({
  initialData = [],
}: ServerMonitorDashboardProps) {
  const [data, setData] = useState<ServerMonitorData[]>(initialData);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeDisplay, setTimeDisplay] = useState<string>("방금");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/server-monitor");
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/login";
        return;
      }
      if (res.ok) {
        const newData: ServerMonitorData[] = await res.json();
        setData(newData);
        setLastUpdated(new Date());
      }
    } catch {
      // Silently fail - will retry on next interval
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // initialData 없이 렌더된 경우 마운트 즉시 fetch (SSR 제거로 인한 빈 상태 처리)
  useEffect(() => {
    if (data.length === 0) refresh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Update time display every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDisplay(timeAgo(lastUpdated));
    }, 1_000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div className="space-y-4">
      {/* Update indicator */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          마지막 업데이트: {timeDisplay}
          {isRefreshing && (
            <span className="ml-2 text-gray-300">새로고침 중...</span>
          )}
        </p>
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          수동 새로고침
        </button>
      </div>

      {/* Server cards */}
      {data.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-medium text-gray-900">
            등록된 서버가 없습니다
          </p>
          <p className="mt-2 text-sm text-gray-500">
            모니터링 대상 서버가 아직 설정되지 않았습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {data.map((serverData) => (
            <ServerCard key={serverData.server.id} data={serverData} />
          ))}
        </div>
      )}
    </div>
  );
}
