import Link from "next/link";
import { getDemoProjects } from "@/lib/queries";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/layout/Container";
import type { Project } from "@/types";

export const metadata = {
  title: "Demo | 스마트데이터연구실",
  description: "연구 프로젝트의 데모를 직접 체험해보세요",
};

function DemoCard({ project }: { project: Project }) {
  return (
    <div className="group bg-white rounded-2xl border border-border hover:shadow-lg hover:shadow-black/5 transition-all duration-200 overflow-hidden flex flex-col">
      {project.thumbnail && (
        <div className="relative aspect-video overflow-hidden bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <Link
          href={`/projects/${project.slug}`}
          className="text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-2 mb-2"
        >
          {project.title}
        </Link>

        {project.shortDescription && (
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-4">
            {project.shortDescription}
          </p>
        )}

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-muted text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <a
            href={project.demoUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
          >
            데모 보기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default async function DemosPage() {
  const projects = await getDemoProjects();

  return (
    <>
      <PageHero
        title="Demo"
        description="연구 프로젝트의 데모를 직접 체험해보세요"
        breadcrumb="Demo"
      />

      <section className="py-12">
        <Container>
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-secondary text-base">
                등록된 데모가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <DemoCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
