import Link from "next/link";
import { getAllPublications } from "@/lib/queries";
import { togglePublicationVisibility } from "@/actions/visibility";
import DeletePublicationButton from "./DeletePublicationButton";
import VisibilityToggleButton from "@/components/professor/VisibilityToggleButton";

const TYPE_LABELS: Record<string, string> = {
  journal: "저널",
  conference: "학회",
  patent: "특허",
  report: "보고서",
  thesis: "학위논문",
};

export default async function PublicationsListPage() {
  const publications = await getAllPublications();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">논문 관리</h1>
        <Link
          href="/professor/publications/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          새로 추가
        </Link>
      </div>

      {publications.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">등록된 논문이 없습니다.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  제목
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  유형
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  연도
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                  학술지/학회
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {publications.map((pub, i) => (
                <tr
                  key={pub.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="max-w-xs truncate px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900">
                    {pub.title}
                    {pub.isFeatured && (
                      <span className="ml-2 inline-block rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
                        주요
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600">
                    {TYPE_LABELS[pub.type] ?? pub.type}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600">
                    {pub.year}
                  </td>
                  <td className="max-w-[200px] truncate px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600 hidden lg:table-cell">
                    {pub.venue}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-right text-sm">
                    <VisibilityToggleButton
                      id={pub.id}
                      initialIsPublic={pub.isPublic}
                      toggle={togglePublicationVisibility}
                    />
                    <Link
                      href={`/professor/publications/${pub.id}/edit`}
                      className="ml-3 text-green-700 hover:text-green-900"
                    >
                      수정
                    </Link>
                    <DeletePublicationButton id={pub.id} />
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
