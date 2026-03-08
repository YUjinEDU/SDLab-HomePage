"use client";

import { useState, useMemo } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/layout/Container";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import type { Project } from "@/types";

type FilterState = {
  status?: string;
  category?: string;
  search?: string;
};

type Props = {
  projects: Project[];
};

export function ProjectsPageClient({ projects }: Props) {
  const [filters, setFilters] = useState<FilterState>({});

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))).sort(),
    [projects],
  );

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      if (filters.status && project.status !== filters.status) return false;
      if (filters.category && project.category !== filters.category)
        return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(q);
        const matchDesc = project.shortDescription.toLowerCase().includes(q);
        const matchOrg = project.organization.toLowerCase().includes(q);
        const matchTags = project.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchOrg && !matchTags) return false;
      }
      return true;
    });
  }, [projects, filters]);

  return (
    <>
      <PageHero
        title="프로젝트"
        description="스마트데이터연구실의 연구 프로젝트"
        breadcrumb="프로젝트"
      />

      <section className="py-12">
        <Container>
          <div className="flex flex-col gap-8">
            <ProjectFilters
              categories={categories}
              filters={filters}
              onChange={setFilters}
            />
            <ProjectGrid projects={filtered} />
          </div>
        </Container>
      </section>
    </>
  );
}
