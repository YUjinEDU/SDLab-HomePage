import Link from "next/link";
import { getMembers } from "@/lib/queries/members";
import { DeleteMemberButton } from "./DeleteMemberButton";

const groupBadgeColors: Record<string, string> = {
  professor: "bg-emerald-100 text-emerald-800",
  phd: "bg-blue-100 text-blue-800",
  ms: "bg-violet-100 text-violet-800",
  undergraduate: "bg-amber-100 text-amber-800",
  alumni: "bg-gray-100 text-gray-600",
};

const groupLabels: Record<string, string> = {
  professor: "지도교수",
  phd: "박사과정",
  ms: "석사과정",
  undergraduate: "학부연구생",
  alumni: "졸업생",
};

export default async function ProfessorMembersPage() {
  const members = await getMembers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">멤버 관리</h1>
        <Link
          href="/professor/members/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          새 멤버 추가
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">등록된 멤버가 없습니다.</p>
          <Link
            href="/professor/members/new"
            className="mt-3 inline-block text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            첫 멤버를 추가하세요
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    이름
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    그룹
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    직위
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    이메일
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.nameKo}
                        </p>
                        <p className="text-xs text-gray-500">{member.nameEn}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${groupBadgeColors[member.group] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {groupLabels[member.group] ?? member.group}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {member.position}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {member.email ?? <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/professor/members/${member.id}/edit`}
                          className="text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                        >
                          수정
                        </Link>
                        <DeleteMemberButton
                          memberId={member.id}
                          memberName={member.nameKo}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
