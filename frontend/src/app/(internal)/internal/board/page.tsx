import Link from "next/link";
import { getAnnouncements } from "@/lib/queries/announcements";
import { auth } from "@/lib/auth/auth";

export default async function BoardPage() {
  const [announcements, session] = await Promise.all([
    getAnnouncements(),
    auth(),
  ]);

  const role = session?.user?.role;
  const canManage = role === "professor" || role === "admin";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">공지 게시판</h1>
      </div>

      {announcements.length === 0 ? (
        <div className="rounded-xl bg-white border border-gray-200 p-12 text-center">
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
            className="mx-auto mb-3 text-gray-300"
          >
            <path d="m3 11 18-5v12L3 14v-3z" />
            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
          </svg>
          <p className="text-gray-500 text-sm">등록된 공지가 없습니다.</p>
        </div>
      ) : (
        <div className="rounded-xl bg-white border border-gray-200 divide-y divide-gray-100">
          {announcements.map((item) => (
            <Link
              key={item.id}
              href={`/internal/board/${item.id}`}
              className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {item.isPinned && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700">
                      📌 고정
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.authorName ?? "관리자"} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-gray-300 mt-1"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      )}

      {canManage && (
        <div className="mt-4 text-right">
          <Link
            href="/professor/board"
            className="text-sm text-emerald-700 hover:text-emerald-900 font-medium"
          >
            게시판 관리 →
          </Link>
        </div>
      )}
    </div>
  );
}
