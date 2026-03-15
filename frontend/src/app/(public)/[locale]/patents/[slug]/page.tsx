import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import { TagBadge } from "@/components/shared/TagBadge";
import {
  getPatentBySlug,
  getMembers,
  getProjects,
  getResearchAreas,
} from "@/lib/queries";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const patent = await getPatentBySlug(slug);
  if (!patent) return { title: "Patent Not Found" };
  return {
    title: `${patent.title} | SD Lab`,
    description: patent.abstract ?? `${patent.venue}, ${patent.year}`,
  };
}

export default async function PatentDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const [patent, members, projects, researchAreas, t] = await Promise.all([
    getPatentBySlug(slug),
    getMembers(),
    getProjects(),
    getResearchAreas(),
    getTranslations({ locale, namespace: "patents" }),
  ]);

  if (!patent) notFound();

  const relatedProjects = projects.filter((proj) =>
    patent.projectIds.includes(proj.id),
  );
  const relatedAreas = researchAreas.filter((area) =>
    patent.researchAreaIds.includes(area.id),
  );
  const authorMembers = patent.authorMemberIds
    .map((id) => members.find((m) => m.id === id))
    .filter(Boolean);

  const venueDate =
    patent.month != null
      ? `${patent.venue}, ${patent.year}.${patent.month}`
      : `${patent.venue}, ${patent.year}`;

  return (
    <div className="py-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-6 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <Link
            href="/patents"
            className="hover:text-primary transition-colors"
          >
            {t("pageTitle")}
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground truncate max-w-[150px] sm:max-w-[300px]">
            {patent.title}
          </span>
        </nav>

        {/* Back link */}
        <Link
          href="/patents"
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

        <div className="max-w-3xl">
          {/* Type badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              {t("labelPatent")}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug mb-4">
            {patent.title}
          </h1>

          {/* Inventors */}
          <p className="text-base text-text-secondary mb-2">
            {patent.authors.map((author, idx) => {
              const memberMatch = authorMembers.find(
                (m) => m!.nameEn === author || m!.nameKo === author,
              );
              return (
                <span key={author}>
                  {idx > 0 && ", "}
                  {memberMatch ? (
                    <Link
                      href={`/members/${memberMatch.slug}`}
                      className="text-primary hover:text-primary-dark transition-colors font-medium"
                    >
                      {author}
                    </Link>
                  ) : (
                    author
                  )}
                </span>
              );
            })}
          </p>

          {/* Venue */}
          <p className="text-sm text-text-secondary italic mb-6">{venueDate}</p>

          <hr className="border-border my-8" />

          {/* Abstract */}
          {patent.abstract && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Abstract
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary">
                {patent.abstract}
              </p>
            </section>
          )}

          {/* Keywords */}
          {patent.keywords.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                키워드
              </h2>
              <div className="flex flex-wrap gap-2">
                {patent.keywords.map((kw) => (
                  <TagBadge key={kw} label={kw} variant="primary" />
                ))}
              </div>
            </section>
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

          {/* Related projects */}
          {relatedProjects.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                관련 프로젝트
              </h2>
              <div className="flex flex-col gap-3">
                {relatedProjects.map((proj) => (
                  <Link
                    key={proj.id}
                    href={`/projects/${proj.slug}`}
                    className="rounded-xl border border-border bg-surface p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {proj.title}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {proj.shortDescription}
                        </p>
                      </div>
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
                        className="shrink-0 text-text-secondary mt-0.5"
                        aria-hidden="true"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}
