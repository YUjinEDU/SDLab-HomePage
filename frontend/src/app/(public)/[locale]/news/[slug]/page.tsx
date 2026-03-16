import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import { getNewsBySlug, getProjects, getPublications } from "@/lib/queries";

const CATEGORY_STYLES: Record<string, string> = {
  notice: "bg-blue-50 text-blue-700 border border-blue-200",
  award: "bg-amber-50 text-amber-700 border border-amber-200",
  event: "bg-violet-50 text-violet-700 border border-violet-200",
  acceptance: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  recruitment: "bg-rose-50 text-rose-700 border border-rose-200",
};

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) return { title: "News Not Found" };
  return {
    title: `${news.title} | SD Lab`,
    description: news.summary,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const [news, projects, publications, t] = await Promise.all([
    getNewsBySlug(slug),
    getProjects(),
    getPublications(),
    getTranslations({ locale, namespace: "news" }),
  ]);

  if (!news) notFound();

  const CATEGORY_LABELS: Record<string, string> = {
    notice: t("categoryNotice"),
    acceptance: t("categoryAcceptance"),
    award: t("categoryAward"),
    recruitment: t("categoryRecruitment"),
    event: t("categoryEvent"),
  };

  const relatedProjects = projects.filter((proj) =>
    news.relatedProjectIds.includes(proj.id),
  );
  const relatedPublications = publications.filter((pub) =>
    news.relatedPublicationIds.includes(pub.id),
  );

  const categoryLabel = CATEGORY_LABELS[news.category] ?? news.category;
  const categoryStyle =
    CATEGORY_STYLES[news.category] ??
    "bg-gray-100 text-gray-700 border border-gray-200";

  return (
    <div className="py-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-6 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <Link href="/news" className="hover:text-primary transition-colors">
            {t("pageTitle")}
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground truncate max-w-[300px]">
            {news.title}
          </span>
        </nav>

        {/* Back link */}
        <Link
          href="/news"
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
          {/* Category badge + pinned */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryStyle}`}
            >
              {categoryLabel}
            </span>
            {news.isPinned && (
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
                {t("labelPinned")}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug mb-4">
            {news.title}
          </h1>

          {/* Date */}
          <time className="block text-sm text-text-secondary mb-6">
            {news.date}
          </time>

          <hr className="border-border my-8" />

          {/* Summary */}
          <section className="mb-8">
            <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-line">
              {news.summary}
            </p>
          </section>

          {/* Related publications */}
          {relatedPublications.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {t("sectionRelatedPublications")}
              </h2>
              <div className="flex flex-col gap-3">
                {relatedPublications.map((pub) => (
                  <Link
                    key={pub.id}
                    href={`/publications/${pub.slug}`}
                    className="rounded-xl border border-border bg-surface p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {pub.title}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {pub.venue}, {pub.year}
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

          {/* Related projects */}
          {relatedProjects.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {t("sectionRelatedProjects")}
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
