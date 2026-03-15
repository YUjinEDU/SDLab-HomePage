import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TagBadge } from "@/components/shared/TagBadge";
import { ProjectOutputsSection } from "@/components/projects/ProjectOutputsSection";
import { getProjectBySlug, getMembers, getResearchAreas } from "@/lib/queries";
import { getProjectOutputs } from "@/lib/queries/publications";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | SD Lab`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const [project, members, researchAreas, t] = await Promise.all([
    getProjectBySlug(slug),
    getMembers(),
    getResearchAreas(),
    getTranslations({ locale, namespace: "projects" }),
  ]);

  if (!project) notFound();

  const [outputs] = await Promise.all([getProjectOutputs(project.id)]);

  const relatedMembers = members.filter((m) =>
    project.memberIds.includes(m.id),
  );
  const relatedAreas = researchAreas.filter((area) =>
    project.researchAreaIds.includes(area.id),
  );

  const formatPeriod = (startDate: string, endDate: string | null): string => {
    const formatDate = (d: string) => {
      const [year, month] = d.split("-");
      return `${year}.${month.padStart(2, "0")}`;
    };
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : t("labelCurrentDate");
    return `${start} ~ ${end}`;
  };

  return (
    <div className="py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-6 font-medium">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="opacity-40">/</span>
            <Link
              href="/projects"
              className="hover:text-primary transition-colors"
            >
              {t("pageTitle")}
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
            {t("backToList")}
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
                  {t("labelFunding")}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {project.organization}
                </dd>
              </div>

              {project.programType && (
                <div>
                  <dt className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
                    {t("labelProgramType")}
                  </dt>
                  <dd className="text-sm text-foreground">
                    {project.programType}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
                  {t("labelPeriod")}
                </dt>
                <dd className="text-sm text-foreground">
                  {formatPeriod(project.startDate, project.endDate)}
                </dd>
              </div>

              {project.budget && (
                <div>
                  <dt className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
                    {t("labelBudget")}
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
                {t("sectionDescription")}
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
                {t("labelDemoLink")}
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
                {t("sectionResearchAreas")}
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
                {t("sectionMembers")}
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

          {/* Project outputs (publications + patents) */}
          <ProjectOutputsSection outputs={outputs} t={t} />
        </div>
      </Container>
    </div>
  );
}
