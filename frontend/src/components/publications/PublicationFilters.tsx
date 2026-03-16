"use client";

import { useTranslations } from "next-intl";
import type { PublicationType } from "@/types";
import { SearchInput } from "@/components/shared/SearchInput";

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
  const t = useTranslations("publications");
  const tCommon = useTranslations("common");

  const TYPE_LABELS: Record<string, string> = {
    journal: t("typeJournal"),
    conference: t("typeConference"),
    workshop: t("typeWorkshop"),
    patent: t("typePatent"),
    sw_registration: t("typeSW"),
    thesis: t("typeThesis"),
    report: t("typeReport"),
  };

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
        aria-label={t("filterYear")}
      >
        <option value="">{t("filterYear")}</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {tCommon("year", { year: y })}
          </option>
        ))}
      </select>

      {/* Type select */}
      <select
        value={filters.type ?? ""}
        onChange={(e) => handleType(e.target.value)}
        className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        aria-label={t("filterType")}
      >
        <option value="">{t("filterType")}</option>
        {types.map((tp) => (
          <option key={tp} value={tp}>
            {TYPE_LABELS[tp] ?? tp}
          </option>
        ))}
      </select>

      {/* Search */}
      <div className="flex-1 min-w-0">
        <SearchInput
          placeholder={t("searchPlaceholder")}
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
          {t("resetFilters")}
        </button>
      )}
    </div>
  );
}
