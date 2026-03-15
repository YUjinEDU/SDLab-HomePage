import Link from "next/link";
import { getAllPublications } from "@/lib/queries";
import { togglePublicationVisibility } from "@/actions/visibility";
import DeletePublicationButton from "../publications/DeletePublicationButton";
import VisibilityToggleButton from "@/components/professor/VisibilityToggleButton";

export default async function PatentsListPage() {
  const allPublications = await getAllPublications();
  const patents = allPublications.filter((p) => p.type === "patent");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">특허 관리</h1>
        <Link
          href="/professor/patents/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          새로 추가
        </Link>
      </div>

      {patents.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">등록된 특허가 없습니다.</p>
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
                  저자
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  연도
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patents.map((pat, i) => (
                <tr
                  key={pat.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="max-w-xs truncate px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900">
                    {pat.title}
                  </td>
                  <td className="max-w-[200px] truncate px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600 hidden md:table-cell">
                    {pat.authors.join(", ")}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600">
                    {pat.year}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-right text-sm">
                    <VisibilityToggleButton
                      id={pat.id}
                      initialIsPublic={pat.isPublic}
                      toggle={togglePublicationVisibility}
                    />
                    <Link
                      href={`/professor/patents/${pat.id}/edit`}
                      className="ml-3 text-green-700 hover:text-green-900"
                    >
                      수정
                    </Link>
                    <DeletePublicationButton id={pat.id} />
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
