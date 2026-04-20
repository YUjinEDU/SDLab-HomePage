import { notFound } from "next/navigation";
import Link from "next/link";
import { getAnnouncementById } from "@/lib/queries/announcements";
import { auth } from "@/lib/auth/auth";
import DeleteAnnouncementButton from "./DeleteAnnouncementButton";

type Props = { params: Promise<{ id: string }> };

export default async function BoardDetailPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const [announcement, session] = await Promise.all([
    getAnnouncementById(numId),
    auth(),
  ]);

  if (!announcement) notFound();

  const role = session?.user?.role;
  const canManage = role === "professor" || role === "admin";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/internal/board"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
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
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          목록으로
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              {announcement.isPinned && (
                <span className="inline-flex items-center gap-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700 mb-2">
                  📌 고정
                </span>
              )}
              <h1 className="text-xl font-bold text-gray-900">{announcement.title}</h1>
            </div>
            {canManage && (
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/professor/board/${announcement.id}/edit`}
                  className="text-sm text-emerald-700 hover:text-emerald-900 font-medium"
                >
                  수정
                </Link>
                <DeleteAnnouncementButton id={announcement.id} />
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mb-6">
            {announcement.authorName ?? "관리자"} ·{" "}
            {new Date(announcement.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {announcement.content}
          </div>
        </div>
      </div>
    </div>
  );
}
