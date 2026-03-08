import Link from "next/link";
import { Container } from "@/components/layout/Container";
import type { NewsItem, Publication, Project } from "@/types";

const categoryLabel: Record<string, string> = {
  notice: "공지",
  acceptance: "논문 게재",
  award: "수상",
  recruitment: "모집",
  event: "행사",
};

type LatestNewsSectionProps = {
  news: NewsItem[];
  publications: Publication[];
  projects: Project[];
};

export function LatestNewsSection({
  news: latestNews,
  publications,
  projects,
}: LatestNewsSectionProps) {
  return (
    <section className="py-24 lg:py-32 bg-surface">
      <Container>
        <div className="max-w-4xl mx-auto mb-14">
          <p className="font-display text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            Latest News
          </p>
          <h2 className="font-display text-3xl sm:text-[2.5rem] font-extrabold text-foreground leading-tight">
            최근 <span className="text-gradient">소식</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {latestNews.map((item) => {
            const relatedPubs = publications.filter((p) =>
              item.relatedPublicationIds.includes(p.id),
            );
            const relatedProjs = projects.filter((p) =>
              item.relatedProjectIds.includes(p.id),
            );

            return (
              <div
                key={item.id}
                className="card-hover rounded-2xl border border-border bg-white p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-primary bg-primary-muted px-3 py-1 rounded-full">
                    {categoryLabel[item.category] ?? item.category}
                  </span>
                  <time className="text-xs text-text-secondary">
                    {item.date}
                  </time>
                  {item.isPinned && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      고정
                    </span>
                  )}
                </div>
                <Link href={`/news/${item.slug}`}>
                  <h3 className="text-base font-bold text-foreground leading-snug mb-2 hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.summary}
                </p>

                {/* Related content links */}
                {(relatedPubs.length > 0 || relatedProjs.length > 0) && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border/60">
                    {relatedPubs.map((pub) => (
                      <Link
                        key={pub.id}
                        href={`/publications/${pub.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary-muted/60 hover:bg-primary-muted px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        {pub.title.length > 40
                          ? pub.title.slice(0, 40) + "..."
                          : pub.title}
                      </Link>
                    ))}
                    {relatedProjs.map((proj) => (
                      <Link
                        key={proj.id}
                        href={`/projects/${proj.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary-muted/60 hover:bg-primary-muted px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        {proj.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
