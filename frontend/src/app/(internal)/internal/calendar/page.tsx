export default function CalendarPage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = today.getDate();

  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  // Build calendar grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">연구실 일정</h1>
          <p className="text-sm text-gray-500 mt-1">{monthName}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-gray-900 shadow-sm">
              월간
            </button>
            <button className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-500">
              주간
            </button>
          </div>
          {/* Add button */}
          <button
            disabled
            className="px-4 py-2 text-sm font-medium bg-slate-600 text-white rounded-lg opacity-50 cursor-not-allowed"
          >
            일정 추가
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-4">
          {/* Day labels */}
          <div className="grid grid-cols-7 mb-2">
            {dayLabels.map((label) => (
              <div
                key={label}
                className="text-center text-xs font-medium text-gray-500 py-2"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => (
              <div
                key={i}
                className={`border-t border-gray-100 min-h-[48px] sm:min-h-[72px] p-1.5 ${
                  day === null ? "bg-gray-50/50" : ""
                }`}
              >
                {day !== null && (
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 text-sm rounded-full ${
                      day === todayDate
                        ? "bg-slate-700 text-white font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            다가오는 일정
          </h2>
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p className="text-sm">등록된 일정이 없습니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}
