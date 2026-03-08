import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TagBadge } from "@/components/shared/TagBadge";
import {
  getProjectBySlug,
  getMembers,
  getPublications,
  getResearchAreas,
} from "@/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} | 스마트데이터연구실`,
    description: project.shortDescription,
  };
}

function formatPeriod(startDate: string, endDate: string | null): string {
  const formatDate = (d: string) => {
    const [year, month] = d.split("-");
    return `${year}.${month.padStart(2, "0")}`;
  };
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : "현재";
  return `${start} ~ ${end}`;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [project, members, publications, researchAreas] = await Promise.all([
    getProjectBySlug(slug),
    getMembers(),
    getPublications(),
    getResearchAreas(),
  ]);

  if (!project) notFound();

  const relatedMembers = members.filter((m) =>
    project.memberIds.includes(m.id),
  );
  const relatedPublications = publications.filter((pub) =>
    project.publicationIds.includes(pub.id),
  );
  const relatedAreas = researchAreas.filter((area) =>
    project.researchAreaIds.includes(area.id),
  );

  return (
    <div className="py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-6 font-medium">
            <Link href="/" className="hover:text-primary transition-colors">
              홈
            </Link>
            <span className="opacity-40">/</span>
            <Link
              href="/projects"
              className="hover:text-primary transition-colors"
            >
              프로젝트
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-foreground truncate max-w-[300px]">
              {project.title}
            </span>
          </nav>

          {/* Back link */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            프로젝트 목록
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <StatusBadge status={project.status} />
              <span className="text-sm text-text-secondary">
                {project.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">
              {project.title}
            </h1>
          </div>

          {/* Meta info */}
          <div className="rounded-xl border border-border bg-surface p-6 mb-8">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <dt className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
                  주관기관
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {project.organization}
                </dd>
              </div>

              {project.programType && (
                <div>
                  <dt className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
                    사업명
                  </dt>
                  <dd className="text-sm text-foreground">
                    {project.programType}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
                  기간
                </dt>
                <dd className="text-sm text-foreground">
                  {formatPeriod(project.startDate, project.endDate)}
                </dd>
              </div>

              {project.budget && (
                <div>
                  <dt className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
                    연구비
                  </dt>
                  <dd className="text-sm text-foreground">{project.budget}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Description */}
          {project.fullDescription && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                연구 개요
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {project.fullDescription}
              </p>
            </section>
          )}

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <TagBadge key={tag} label={tag} variant="primary" />
              ))}
            </div>
          )}

          {/* Demo link */}
          {project.demoUrl && (
            <div className="mb-8">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                데모 보기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              </a>
            </div>
          )}

          {/* Related research areas */}
          {relatedAreas.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                연구 분야
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedAreas.map((area) => (
                  <Link
                    key={area.id}
                    href="/research"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface hover:border-primary/40 hover:bg-primary-muted/30 transition-colors text-sm font-medium text-foreground"
                  >
                    {area.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related members */}
          {relatedMembers.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                참여 연구원
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedMembers.map((member) => (
                  <Link
                    key={member.id}
                    href={`/members/${member.slug}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface hover:border-primary/40 hover:bg-primary-muted/30 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary-muted/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">
                        {member.nameKo.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground leading-none">
                        {member.nameKo}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {member.position}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related publications */}
          {relatedPublications.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                관련 논문
              </h2>
              <ul className="flex flex-col gap-3">
                {relatedPublications.map((pub) => (
                  <li key={pub.id}>
                    <Link
                      href={`/publications/${pub.slug}`}
                      className="block rounded-lg border border-border bg-surface p-4 hover:border-primary/40 hover:bg-primary-muted/20 transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground leading-snug">
                        {pub.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-1.5">
                        {pub.venue} &middot; {pub.year}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}
