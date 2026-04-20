import Link from "next/link";
import { getAnnouncements } from "@/lib/queries/announcements";
import DeleteBoardButton from "./DeleteBoardButton";

export default async function ProfessorBoardPage() {
  const announcements = await getAnnouncements();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">게시판 관리</h1>
        <Link
          href="/professor/board/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          새 공지 작성
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">등록된 공지가 없습니다.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  제목
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hidden md:table-cell">
                  작성자
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hidden md:table-cell">
                  날짜
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  고정
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {announcements.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="max-w-xs truncate px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900">
                    {item.isPinned && (
                      <span className="mr-1.5 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700">
                        고정
                      </span>
                    )}
                    {item.title}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600 hidden md:table-cell">
                    {item.authorName ?? "관리자"}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600 hidden md:table-cell">
                    {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600">
                    {item.isPinned ? "Y" : ""}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-right text-sm">
                    <Link
                      href={`/professor/board/${item.id}/edit`}
                      className="mr-3 text-green-700 hover:text-green-900"
                    >
                      수정
                    </Link>
                    <DeleteBoardButton id={item.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
