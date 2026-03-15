// TODO: Phase 8 will rebuild patent creation against the new patents table (Migration 005).
// Patents have been separated from publications with a different field structure.
export default function NewPatentPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">특허 등록</h1>
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-6 text-center">
        <p className="text-amber-800 font-medium mb-2">
          특허 등록 기능 준비 중
        </p>
        <p className="text-amber-700 text-sm">
          특허 데이터가 별도 테이블로 분리되었습니다. Phase 8에서 새로운 특허
          등록 기능이 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
}
