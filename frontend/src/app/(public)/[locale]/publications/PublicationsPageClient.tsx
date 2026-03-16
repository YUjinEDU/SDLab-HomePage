"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/layout/Container";
import { Pagination } from "@/components/shared/Pagination";
import { PublicationStatsPanel } from "@/components/publications/PublicationStatsPanel";
import { PublicationFilters } from "@/components/publications/PublicationFilters";
import { PublicationList } from "@/components/publications/PublicationList";
import type { Publication, PublicationType, Member } from "@/types";

const PER_PAGE = 10;

type FilterState = {
  year?: number;
  type?: string;
  search?: string;
};

type Props = {
  publications: Publication[];
  members: Pick<Member, "nameKo" | "nameEn" | "slug">[];
};

export function PublicationsPageClient({ publications, members }: Props) {
  const t = useTranslations("publications");
  const [filters, setFilters] = useState<FilterState>({});
  const [page, setPage] = useState(1);

  const years = useMemo(() => {
    const set = new Set(publications.map((p) => p.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [publications]);

  const types = useMemo(() => {
    const set = new Set(publications.map((p) => p.type));
    return Array.from(set) as PublicationType[];
  }, [publications]);

  const filtered = useMemo(() => {
    const searchLower = filters.search?.toLowerCase().trim() ?? "";
    return publications.filter((pub) => {
      if (filters.year && pub.year !== filters.year) return false;
      if (filters.type && pub.type !== filters.type) return false;
      if (searchLower) {
        const haystack = [pub.title, ...pub.authors, pub.venue, ...pub.keywords]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(searchLower)) return false;
      }
      return true;
    });
  }, [publications, filters]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  const handleFiltersChange = (next: FilterState) => {
    setFilters(next);
    setPage(1);
  };

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
            <PublicationStatsPanel publications={publications} />

            <PublicationFilters
              years={years}
              types={types}
              filters={filters}
              onChange={handleFiltersChange}
            />

            <PublicationList
              publications={paginated}
              members={members}
              emptyMessage={
                Object.keys(filters).some(
                  (k) =>
                    filters[k as keyof FilterState] !== undefined &&
                    filters[k as keyof FilterState] !== "",
                )
                  ? t("emptyFiltered")
                  : t("empty")
              }
            />

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
