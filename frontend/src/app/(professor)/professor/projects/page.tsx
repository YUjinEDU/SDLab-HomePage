import Link from "next/link";
import { getAllProjects } from "@/lib/queries";
import { toggleProjectVisibility } from "@/actions/visibility";
import DeleteProjectButton from "./DeleteProjectButton";
import VisibilityToggleButton from "@/components/professor/VisibilityToggleButton";

const STATUS_LABELS: Record<string, string> = {
  planned: "계획",
  active: "진행중",
  completed: "완료",
  archived: "보관",
};

const STATUS_COLORS: Record<string, string> = {
  planned: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
  archived: "bg-yellow-100 text-yellow-700",
};

export default async function ProjectsListPage() {
  const projects = await getAllProjects();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">프로젝트 관리</h1>
        <Link
          href="/professor/projects/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          새로 추가
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">등록된 프로젝트가 없습니다.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  프로젝트명
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  상태
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hidden md:table-cell">
                  기관
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  기간
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((proj, i) => (
                <tr
                  key={proj.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="max-w-xs truncate px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900">
                    {proj.title}
                    {proj.isFeatured && (
                      <span className="ml-2 inline-block rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
                        주요
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-sm">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[proj.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {STATUS_LABELS[proj.status] ?? proj.status}
                    </span>
                  </td>
                  <td className="max-w-[160px] truncate px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600 hidden md:table-cell">
                    {proj.organization}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-600">
                    {proj.startDate}
                    {proj.endDate ? ` ~ ${proj.endDate}` : " ~"}
                  </td>
                  <td className="whitespace-nowrap px-2 sm:px-4 py-2 sm:py-3 text-right text-sm">
                    <VisibilityToggleButton
                      id={proj.id}
                      initialIsPublic={proj.isPublic}
                      toggle={toggleProjectVisibility}
                    />
                    <Link
                      href={`/professor/projects/${proj.id}/edit`}
                      className="ml-3 text-green-700 hover:text-green-900"
                    >
                      수정
                    </Link>
                    <DeleteProjectButton id={proj.id} />
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
