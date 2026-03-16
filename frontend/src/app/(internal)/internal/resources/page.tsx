export default function ResourcesPage() {
  const categories = [
    { key: "onboarding", label: "온보딩" },
    { key: "server", label: "서버 가이드" },
    { key: "experiment", label: "실험 문서" },
    { key: "presentation", label: "발표자료" },
    { key: "links", label: "링크" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">내부 자료실</h1>
          <p className="text-sm text-gray-500 mt-1">
            연구실 내부 문서 및 자료 모음
          </p>
        </div>
        <button
          disabled
          className="px-4 py-2 text-sm font-medium bg-slate-600 text-white rounded-lg opacity-50 cursor-not-allowed"
        >
          자료 추가
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="자료 검색..."
            disabled
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {categories.map((cat, idx) => (
            <button
              key={cat.key}
              className={`px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                idx === 0
                  ? "text-slate-700 border-b-2 border-slate-700 bg-slate-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-3"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p className="text-sm">등록된 자료가 없습니다</p>
          <p className="text-xs text-gray-300 mt-1">
            자료를 추가하면 여기에 표시됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
