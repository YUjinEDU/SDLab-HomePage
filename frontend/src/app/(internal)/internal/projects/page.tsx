export default function InternalProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">내부 프로젝트</h1>
        <p className="text-sm text-gray-500 mt-1">
          연구실 내부 진행 중인 프로젝트 현황
        </p>
      </div>

      {/* Project cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Placeholder cards */}
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center min-h-[180px] text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <p className="text-sm">프로젝트를 등록해주세요</p>
          </div>
        ))}
      </div>

      {/* Info note */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">
          내부 프로젝트는 연구실 구성원만 열람할 수 있습니다. 공개 프로젝트는{" "}
          <span className="text-slate-600 font-medium">공개 사이트</span>에서
          확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
