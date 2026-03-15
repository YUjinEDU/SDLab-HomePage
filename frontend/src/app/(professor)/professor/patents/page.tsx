import Link from "next/link";

// TODO: Phase 8 will rebuild patent management against the new patents table (Migration 005).
// Patents have been separated from publications — this page is temporarily disabled.
export default function PatentsListPage() {
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

      <div className="rounded-lg bg-amber-50 border border-amber-200 p-6 text-center">
        <p className="text-amber-800 font-medium mb-2">
          특허 관리 기능 준비 중
        </p>
        <p className="text-amber-700 text-sm">
          특허 데이터가 별도 테이블로 분리되었습니다. Phase 8에서 새로운 특허
          관리 기능이 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
}
