"use client";

import { useState, useMemo } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/layout/Container";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { PatentCard } from "@/components/patents/PatentCard";
import type { Publication } from "@/types";

const PER_PAGE = 10;

type FilterState = {
  year?: number;
  search?: string;
};

type Props = {
  patents: Publication[];
};

export function PatentsPageClient({ patents }: Props) {
  const [filters, setFilters] = useState<FilterState>({});
  const [page, setPage] = useState(1);

  const years = useMemo(() => {
    const set = new Set(patents.map((p) => p.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [patents]);

  const filtered = useMemo(() => {
    const searchLower = filters.search?.toLowerCase().trim() ?? "";
    return patents.filter((pat) => {
      if (filters.year && pat.year !== filters.year) return false;
      if (searchLower) {
        const haystack = [pat.title, ...pat.authors, ...pat.keywords]
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
        title="특허"
        description="스마트데이터연구실의 등록 및 출원 특허 목록"
        breadcrumb="Patents"
      />

      <section className="py-12">
        <Container>
          <div className="flex flex-col gap-6">
            {/* Stats */}
            <div className="rounded-xl border border-border bg-surface px-6 py-4">
              <dl className="flex flex-wrap gap-x-8 gap-y-3">
                <div className="flex items-baseline gap-2">
                  <dt className="text-sm text-text-secondary">전체 특허</dt>
                  <dd className="text-lg font-semibold text-foreground">
                    {patents.length}
                  </dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="text-sm text-text-secondary">연도 범위</dt>
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
                aria-label="연도 필터"
              >
                <option value="">전체 연도</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>

              <div className="flex-1 min-w-0">
                <SearchInput
                  placeholder="특허명, 발명자, 키워드 검색..."
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
                  초기화
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
                title="특허가 없습니다"
                description={
                  hasActiveFilters
                    ? "필터 조건에 맞는 특허가 없습니다. 다른 조건으로 검색해 보세요."
                    : "등록된 특허가 없습니다."
                }
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
