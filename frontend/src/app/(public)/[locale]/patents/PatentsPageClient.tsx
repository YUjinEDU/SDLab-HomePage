"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/layout/Container";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { PatentCard } from "@/components/patents/PatentCard";
import type { Patent } from "@/types";

const PER_PAGE = 10;

type FilterState = {
  year?: number;
  search?: string;
};

type Props = {
  patents: Patent[];
};

export function PatentsPageClient({ patents }: Props) {
  const t = useTranslations("patents");
  const tCommon = useTranslations("common");
  const [filters, setFilters] = useState<FilterState>({});
  const [page, setPage] = useState(1);

  // Extract year from date field (format: "YYYY-MM-DD" or "YYYY")
  const getPatentYear = (pat: Patent): number | null => {
    if (!pat.date) return null;
    const year = parseInt(pat.date.slice(0, 4), 10);
    return isNaN(year) ? null : year;
  };

  const years = useMemo(() => {
    const set = new Set(
      patents.map(getPatentYear).filter((y): y is number => y !== null),
    );
    return Array.from(set).sort((a, b) => b - a);
  }, [patents]);

  const filtered = useMemo(() => {
    const searchLower = filters.search?.toLowerCase().trim() ?? "";
    return patents.filter((pat) => {
      if (filters.year && getPatentYear(pat) !== filters.year) return false;
      if (searchLower) {
        const haystack = [pat.title, pat.titleEn ?? "", ...pat.inventors]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(searchLower)) return false;
      }
      return true;
    });
  }, [patents, filters]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  const handleFiltersChange = (next: FilterState) => {
    setFilters(next);
    setPage(1);
  };

  const hasActiveFilters =
    filters.year !== undefined ||
    (filters.search !== undefined && filters.search !== "");

  return (
    <>
      <PageHero
        title={t("pageTitle")}
        description={t("pageDescription")}
        breadcrumb={t("pageTitle")}
      />

      <section className="py-12">
        <Container>
          <div className="flex flex-col gap-6">
            {/* Stats */}
            <div className="rounded-xl border border-border bg-surface px-6 py-4">
              <dl className="flex flex-wrap gap-x-8 gap-y-3">
                <div className="flex items-baseline gap-2">
                  <dt className="text-sm text-text-secondary">
                    {t("labelPatent")}
                  </dt>
                  <dd className="text-lg font-semibold text-foreground">
                    {patents.length}
                  </dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="text-sm text-text-secondary">
                    {t("filterYear")}
                  </dt>
                  <dd className="text-lg font-semibold text-foreground">
                    {years.length > 0
                      ? `${years[years.length - 1]} – ${years[0]}`
                      : "-"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filters.year ?? ""}
                onChange={(e) =>
                  handleFiltersChange({
                    ...filters,
                    year: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
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

              <div className="flex-1 min-w-0">
                <SearchInput
                  placeholder={t("searchPlaceholder")}
                  value={filters.search ?? ""}
                  onChange={(v) =>
                    handleFiltersChange({ ...filters, search: v || undefined })
                  }
                />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={() => handleFiltersChange({})}
                  className="h-10 px-4 text-sm font-medium text-text-secondary hover:text-foreground border border-border rounded-lg hover:bg-primary-muted/30 transition-colors whitespace-nowrap"
                >
                  {t("resetFilters")}
                </button>
              )}
            </div>

            {/* List */}
            {paginated.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {paginated.map((pat) => (
                  <li key={pat.id}>
                    <PatentCard patent={pat} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title={t("labelPatent")}
                description={hasActiveFilters ? t("emptyFiltered") : t("empty")}
              />
            )}

            {filtered.length > PER_PAGE && (
              <div className="pt-4">
                <Pagination
                  total={filtered.length}
                  page={page}
                  perPage={PER_PAGE}
                  onChange={setPage}
                />
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
