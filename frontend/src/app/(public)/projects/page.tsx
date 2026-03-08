"use client";

import { useState, useMemo } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/layout/Container";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { projects } from "@/data/projects";

type FilterState = {
  status?: string;
  category?: string;
  search?: string;
};

const categories = Array.from(new Set(projects.map((p) => p.category))).sort();

export default function ProjectsPage() {
  const [filters, setFilters] = useState<FilterState>({});

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
  }, [filters]);

  return (
    <>
      <PageHero
        title="프로젝트"
        description="스마트데이터연구실의 연구 프로젝트"
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
