"use client";

import { useTranslations } from "next-intl";
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

export function ProjectFilters({
  categories,
  filters,
  onChange,
}: ProjectFiltersProps) {
  const t = useTranslations("projects");

  const STATUS_OPTIONS: { value: string; label: string }[] = [
    { value: "", label: t("filterStatus") },
    { value: "active", label: t("statusOngoing") },
    { value: "completed", label: t("statusCompleted") },
  ];

  const categoryOptions = [
    { value: "", label: t("filterYear") },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 min-w-0">
        <SearchInput
          placeholder={t("searchPlaceholder")}
          value={filters.search ?? ""}
          onChange={(value) => onChange({ ...filters, search: value })}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
        <select
          value={filters.status ?? ""}
          onChange={(e) =>
            onChange({ ...filters, status: e.target.value || undefined })
          }
          className="px-3 py-2.5 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          aria-label={t("filterStatus")}
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
          aria-label={t("filterYear")}
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
