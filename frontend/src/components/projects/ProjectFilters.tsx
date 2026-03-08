"use client";

import { SearchInput } from "@/components/shared/SearchInput";

type FilterState = {
  status?: string;
  category?: string;
  search?: string;
};

type ProjectFiltersProps = {
  categories: string[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "전체 상태" },
  { value: "active", label: "진행중" },
  { value: "completed", label: "완료" },
  { value: "planned", label: "예정" },
];

export function ProjectFilters({
  categories,
  filters,
  onChange,
}: ProjectFiltersProps) {
  const categoryOptions = [
    { value: "", label: "전체 분야" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 min-w-0">
        <SearchInput
          placeholder="프로젝트 검색..."
          value={filters.search ?? ""}
          onChange={(value) => onChange({ ...filters, search: value })}
        />
      </div>

      <div className="flex gap-3 flex-shrink-0">
        <select
          value={filters.status ?? ""}
          onChange={(e) =>
            onChange({ ...filters, status: e.target.value || undefined })
          }
          className="px-3 py-2.5 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          aria-label="상태 필터"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={filters.category ?? ""}
          onChange={(e) =>
            onChange({ ...filters, category: e.target.value || undefined })
          }
          className="px-3 py-2.5 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          aria-label="분야 필터"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
