import Link from "next/link";
import { auth } from "@/lib/auth/auth";

export default async function InternalHome() {
  const session = await auth();

  const quickLinks = [
    { href: "/internal/calendar", label: "일정" },
    { href: "/internal/gpu", label: "GPU 모니터" },
    { href: "/internal/resources", label: "자료실" },
    { href: "/internal/projects", label: "내부 프로젝트" },
  ];

  const servers = [
    { name: "서버 1", status: "확인 중" },
    { name: "서버 2", status: "확인 중" },
    { name: "서버 3", status: "확인 중" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">내부 포털</h1>
        <p className="text-sm text-gray-500 mt-1">
          {session?.user?.email ?? "사용자"}님, 안녕하세요.
        </p>
      </div>

      {/* Top cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 오늘 일정 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">오늘 일정</h2>
            <Link
              href="/internal/calendar"
              className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              전체 보기
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
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

        {/* 최근 공지 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">최근 공지</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2"
            >
              <path d="m3 11 18-5v12L3 14v-3z" />
              <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
            </svg>
            <p className="text-sm">등록된 공지가 없습니다</p>
          </div>
        </div>
      </div>

      {/* GPU 상태 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">GPU 상태</h2>
          <Link
            href="/internal/gpu"
            className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
          >
            상세 보기
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {servers.map((server) => (
            <div
              key={server.name}
              className="border border-gray-100 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {server.name}
                </span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                  {server.status}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>GPU</span>
                    <span>--</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>메모리</span>
                    <span>--</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 메뉴</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-slate-400 hover:text-slate-700 transition-colors text-center"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
