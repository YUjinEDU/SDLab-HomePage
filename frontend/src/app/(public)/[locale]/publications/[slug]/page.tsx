import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import { TagBadge } from "@/components/shared/TagBadge";
import { PublicationExternalLinks } from "@/components/publications/PublicationExternalLinks";
import { BibtexCopyButton } from "@/components/publications/BibtexCopyButton";
import { ProjectBacklink } from "@/components/shared/ProjectBacklink";
import {
  getPublicationBySlug,
  getMembers,
  getProjects,
  getResearchAreas,
} from "@/lib/queries";
import type { Publication } from "@/types";

const TYPE_STYLES: Record<string, string> = {
  journal: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  conference: "bg-blue-50 text-blue-700 border border-blue-200",
  workshop: "bg-violet-50 text-violet-700 border border-violet-200",
  patent: "bg-amber-50 text-amber-700 border border-amber-200",
  thesis: "bg-rose-50 text-rose-700 border border-rose-200",
  report: "bg-gray-100 text-gray-700 border border-gray-200",
};

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const pub = await getPublicationBySlug(slug);
  if (!pub) return { title: "Publication Not Found" };
  return {
    title: `${pub.title} | SD Lab`,
    description: pub.abstract ?? `${pub.venue}, ${pub.year}`,
  };
}

export default async function PublicationDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const [pub, members, projects, researchAreas, t] = await Promise.all([
    getPublicationBySlug(slug),
    getMembers(),
    getProjects(),
    getResearchAreas(),
    getTranslations({ locale, namespace: "publications" }),
  ]);

  const TYPE_LABELS: Record<string, string> = {
    journal: t("typeJournal"),
    conference: t("typeConference"),
    workshop: t("typeWorkshop"),
    patent: t("typePatent"),
    thesis: t("typeThesis"),
    report: t("typeReport"),
  };

  if (!pub) notFound();

  const relatedProjects = projects.filter((proj) =>
    pub.projectIds.includes(proj.id),
  );
  const relatedAreas = researchAreas.filter((area) =>
    pub.researchAreaIds.includes(area.id),
  );
  const authorMembers = pub.authorMemberIds
    .map((id) => members.find((m) => m.id === id))
    .filter(Boolean);

  const typeLabel = TYPE_LABELS[pub.type] ?? pub.type;
  const typeStyle =
    TYPE_STYLES[pub.type] ?? "bg-gray-100 text-gray-700 border border-gray-200";
  const venueDate =
    pub.month != null
      ? `${pub.venue}, ${pub.year}.${pub.month}`
      : `${pub.venue}, ${pub.year}`;

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
            href="/publications"
            className="hover:text-primary transition-colors"
          >
            {t("pageTitle")}
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground truncate max-w-[150px] sm:max-w-[300px]">
            {pub.title}
          </span>
        </nav>

        {/* Back link */}
        <Link
          href="/publications"
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
          {/* Type badge + featured */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeStyle}`}
            >
              {typeLabel}
            </span>
            {pub.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {t("labelFeatured")}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug mb-4">
            {pub.title}
          </h1>

          {/* Authors */}
          <p className="text-base text-text-secondary mb-2">
            {pub.authors.map((author, idx) => {
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

          {/* External links */}
          <PublicationExternalLinks doi={pub.doi} pdfUrl={pub.pdfUrl} />

          <hr className="border-border my-8" />

          {/* Abstract */}
          {pub.abstract && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                {t("sectionAbstract")}
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary">
                {pub.abstract}
              </p>
            </section>
          )}

          {/* Keywords */}
          {pub.keywords.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                {t("sectionKeywords")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {pub.keywords.map((kw) => (
                  <TagBadge key={kw} label={kw} variant="primary" />
                ))}
              </div>
            </section>
          )}

          {/* BibTeX */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">BibTeX</h2>
              <BibtexCopyButton publication={pub} />
            </div>
            <pre className="rounded-xl border border-border bg-gray-50 p-4 text-xs text-text-secondary overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
              {pub.bibtex ?? generateBibtexPreview(pub)}
            </pre>
          </section>

          {/* Related research areas */}
          {relatedAreas.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                {t("sectionRelatedAreas")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedAreas.map((area) => (
                  <Link
                    key={area.id}
                    href={`/research`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface hover:border-primary/40 hover:bg-primary-muted/30 transition-colors text-sm font-medium text-foreground"
                  >
                    {area.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related projects */}
          <ProjectBacklink
            projects={relatedProjects}
            label={t("sectionRelatedProjects")}
          />
        </div>
      </Container>
    </div>
  );
}

function generateBibtexPreview(pub: Publication): string {
  const key = `${pub.authors[0]?.split(" ").pop() ?? "Author"}${pub.year}`;
  const entryType = pub.type === "journal" ? "article" : "inproceedings";
  const authorsFormatted = pub.authors.join(" and ");

  const lines = [
    `@${entryType}{${key},`,
    `  author    = {${authorsFormatted}},`,
    `  title     = {${pub.title}},`,
    pub.type === "journal"
      ? `  journal   = {${pub.venue}},`
      : `  booktitle = {${pub.venue}},`,
    `  year      = {${pub.year}},`,
    pub.month != null ? `  month     = {${pub.month}},` : null,
    pub.doi ? `  doi       = {${pub.doi}},` : null,
    `}`,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}
