"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LecturePage() {
  const router = useRouter();
  const [jobId, setJobId] = useState("");

  const handleOpen = () => {
    const id = jobId.trim();
    if (id) router.push(`/professor/lecture/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">강의 자동화 도구</h1>
        <p className="text-sm text-gray-500 mt-1">
          강의 자료 생성 및 스크립트 검수 자동화 도구입니다
        </p>
      </div>

      {/* Job ID로 스크립트 검수 열기 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          스크립트 검수
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          GPU 서버에서 생성된 Job ID를 입력하면 슬라이드별 스크립트를 검수할 수
          있습니다.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleOpen()}
            placeholder="Job ID 입력 (예: abc123-def456)"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />
          <button
            onClick={handleOpen}
            disabled={!jobId.trim()}
            className="px-5 py-2 bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            열기
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          GPU 서버에서{" "}
          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
            python -m lecture_auto.cli parse &lt;file&gt;
          </code>{" "}
          실행 후 출력되는 Job ID를 입력하세요.
        </p>
      </div>

      {/* 실행 이력 (향후 구현) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">실행 이력</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  날짜
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Job ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  상태
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  링크
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-gray-400 text-sm"
                >
                  실행 이력이 없습니다
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
