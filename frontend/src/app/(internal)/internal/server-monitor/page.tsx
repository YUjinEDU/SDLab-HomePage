import { ServerMonitorDashboard } from "@/components/server-monitor/ServerMonitorDashboard";

// SSR에서 getServerMonitorData()를 호출하지 않음.
// 13개 DB 쿼리가 SSR 타임아웃(10s)을 유발할 수 있음.
// 대신 컴포넌트가 마운트 즉시 /api/server-monitor를 호출해 데이터를 가져옴.
export default function ServerMonitorPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">서버 모니터링</h1>
        <p className="text-sm text-gray-500 mt-1">연구실 서버 상태 현황</p>
      </div>

      <ServerMonitorDashboard />
    </div>
  );
}
