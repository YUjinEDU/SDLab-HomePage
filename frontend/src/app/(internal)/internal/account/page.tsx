import { getSession } from "@/actions/auth";

export const metadata = {
  title: "계정 관리 | SD Lab Internal",
};

export default async function AccountPage() {
  const user = await getSession();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">계정 관리</h1>
        <p className="text-sm text-gray-500 mt-1">
          계정 정보를 확인하고 관리합니다
        </p>
      </div>

      {/* 사용자 정보 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          사용자 정보
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            이메일
          </label>
          <input
            type="email"
            readOnly
            value={user?.email ?? ""}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 cursor-default"
          />
        </div>
      </div>

      {/* 비밀번호 변경 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          비밀번호 변경
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              현재 비밀번호
            </label>
            <input
              type="password"
              disabled
              placeholder="현재 비밀번호"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400 placeholder:text-gray-300 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              새 비밀번호
            </label>
            <input
              type="password"
              disabled
              placeholder="새 비밀번호"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400 placeholder:text-gray-300 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              비밀번호 확인
            </label>
            <input
              type="password"
              disabled
              placeholder="새 비밀번호 확인"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400 placeholder:text-gray-300 cursor-not-allowed"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-400">비밀번호 변경 기능 준비 중</p>
            <button
              disabled
              className="px-5 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg opacity-50 cursor-not-allowed"
            >
              변경
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
