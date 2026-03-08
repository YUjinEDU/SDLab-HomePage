"use client";

import type { PublicationType } from "@/types";
import { SearchInput } from "@/components/shared/SearchInput";

const TYPE_LABELS: Record<string, string> = {
  journal: "저널",
  conference: "학술대회",
  workshop: "워크샵",
  patent: "특허",
  thesis: "학위논문",
  report: "보고서",
};

type FilterState = {
  year?: number;
  type?: string;
  search?: string;
};

type PublicationFiltersProps = {
  years: number[];
  types: PublicationType[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
};

export function PublicationFilters({
  years,
  types,
  filters,
  onChange,
}: PublicationFiltersProps) {
  const handleYear = (value: string) => {
    onChange({ ...filters, year: value ? Number(value) : undefined });
  };

  const handleType = (value: string) => {
    onChange({ ...filters, type: value || undefined });
  };

  const handleSearch = (value: string) => {
    onChange({ ...filters, search: value || undefined });
  };

  const hasActiveFilters =
    filters.year !== undefined ||
    filters.type !== undefined ||
    (filters.search !== undefined && filters.search !== "");

  const clearAll = () => {
    onChange({});
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Year select */}
      <select
        value={filters.year ?? ""}
        onChange={(e) => handleYear(e.target.value)}
        className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        aria-label="연도 필터"
      >
        <option value="">전체 연도</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}년
          </option>
        ))}
      </select>

      {/* Type select */}
      <select
        value={filters.type ?? ""}
        onChange={(e) => handleType(e.target.value)}
        className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        aria-label="논문 유형 필터"
      >
        <option value="">전체 유형</option>
        {types.map((t) => (
          <option key={t} value={t}>
            {TYPE_LABELS[t] ?? t}
          </option>
        ))}
      </select>

      {/* Search */}
      <div className="flex-1 min-w-0">
        <SearchInput
          placeholder="제목, 저자, 키워드 검색..."
          value={filters.search ?? ""}
          onChange={handleSearch}
        />
      </div>

      {/* Clear button */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="h-10 px-4 text-sm font-medium text-text-secondary hover:text-foreground border border-border rounded-lg hover:bg-primary-muted/30 transition-colors whitespace-nowrap"
        >
          초기화
        </button>
      )}
    </div>
  );
}
