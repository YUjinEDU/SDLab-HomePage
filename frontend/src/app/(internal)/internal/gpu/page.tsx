export default function GpuMonitorPage() {
  const servers = [
    { name: "GPU 서버 1", gpus: ["RTX 3090", "RTX 3090"] },
    { name: "GPU 서버 2", gpus: ["RTX 4090", "RTX 4090"] },
    { name: "GPU 서버 3", gpus: ["A100 80GB"] },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">GPU 모니터링</h1>
        <p className="text-sm text-gray-500 mt-1">연구실 GPU 서버 사용 현황</p>
      </div>

      {/* Server cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server) => (
          <div
            key={server.name}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            {/* Server header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">
                {server.name}
              </h2>
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">
                오프라인
              </span>
            </div>

            {/* GPU cards */}
            <div className="space-y-4">
              {server.gpus.map((gpu, idx) => (
                <div
                  key={idx}
                  className="border border-gray-100 rounded-lg p-3"
                >
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    {gpu}
                    {server.gpus.length > 1 && (
                      <span className="text-gray-400 ml-1">#{idx}</span>
                    )}
                  </p>

                  {/* GPU Usage */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>GPU 사용률</span>
                      <span>0%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-300 rounded-full"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>

                  {/* Memory */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>메모리</span>
                      <span>0%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-300 rounded-full"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* User info placeholder */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">사용자 정보 없음</p>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-sm text-slate-600">
          실시간 모니터링 시스템 연동 예정입니다. 현재 페이지는 레이아웃
          미리보기입니다.
        </p>
      </div>
    </div>
  );
}
