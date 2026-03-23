import { getServerMonitorData } from "@/lib/queries/server-monitor";
import { ServerMonitorDashboard } from "@/components/server-monitor/ServerMonitorDashboard";

export default async function ServerMonitorPage() {
  const serverData = await getServerMonitorData();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">서버 모니터링</h1>
        <p className="text-sm text-gray-500 mt-1">연구실 서버 상태 현황</p>
      </div>

      <ServerMonitorDashboard initialData={serverData} />
    </div>
  );
}
