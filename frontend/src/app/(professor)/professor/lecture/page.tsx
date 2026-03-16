export const metadata = {
  title: "강의 자동화 도구 | SD Lab Admin",
};

export default function LecturePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">강의 자동화 도구</h1>
        <p className="text-sm text-gray-500 mt-1">
          강의 자료 생성 및 관리 자동화 도구입니다
        </p>
      </div>

      {/* 입력 데이터 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          입력 데이터
        </h2>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-12 flex flex-col items-center justify-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-3"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-sm font-medium">
            파일을 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-xs text-gray-300 mt-1">기능 준비 중</p>
        </div>
      </div>

      {/* 실행 설정 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">실행 설정</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              작업 유형
            </label>
            <select
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
            >
              <option>선택하세요</option>
              <option>슬라이드 생성</option>
              <option>퀴즈 생성</option>
              <option>요약 생성</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              출력 형식
            </label>
            <input
              type="text"
              disabled
              placeholder="예: PDF, PPTX"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400 placeholder:text-gray-300 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* 실행 이력 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">실행 이력</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-500">
                  날짜
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-500">
                  작업 유형
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-500">
                  상태
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-500">
                  결과
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-gray-400 text-sm"
                >
                  실행 이력이 없습니다
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 실행 버튼 */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">강의 자동화 시스템 연동 예정</p>
        <button
          disabled
          className="px-6 py-2.5 bg-emerald-700 text-white text-sm font-medium rounded-lg opacity-50 cursor-not-allowed"
        >
          실행
        </button>
      </div>
    </div>
  );
}
