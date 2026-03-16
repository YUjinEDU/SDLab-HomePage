import Link from "next/link";
import { getNews } from "@/lib/queries";
import DeleteNewsButton from "./DeleteNewsButton";

const CATEGORY_LABELS: Record<string, string> = {
  award: "수상",
  publication: "논문",
  event: "행사",
  media: "언론",
  general: "일반",
};

export default async function NewsListPage() {
  const news = await getNews();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">소식 관리</h1>
        <Link
          href="/professor/news/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          새로 추가
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">등록된 소식이 없습니다.</p>
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
                  카테고리
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
              {news.map((item, i) => (
                <tr
                  key={item.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="max-w-xs truncate px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900">
                    {item.title}
                    {item.isPinned && (
                      <span className="ml-2 inline-block rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
                        고정
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600 hidden md:table-cell">
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600 hidden md:table-cell">
                    {item.date}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600">
                    {item.isPinned ? "Y" : ""}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-right text-sm">
                    <Link
                      href={`/professor/news/${item.id}/edit`}
                      className="mr-3 text-green-700 hover:text-green-900"
                    >
                      수정
                    </Link>
                    <DeleteNewsButton id={item.id} />
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
