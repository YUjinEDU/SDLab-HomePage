import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getNews } from "@/lib/queries";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/shared/PageHero";
import type { NewsItem, BoardCategory } from "@/types";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("newsTitle"), description: t("newsDescription") };
}

const categoryColors: Record<BoardCategory, string> = {
  notice: "bg-blue-100 text-blue-700",
  award: "bg-amber-100 text-amber-700",
  event: "bg-violet-100 text-violet-700",
  acceptance: "bg-green-100 text-green-700",
  recruitment: "bg-rose-100 text-rose-700",
};

function formatDate(dateStr: string, locale: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function NewsCard({
  item,
  locale,
  categoryLabel,
  pinnedLabel,
}: {
  item: NewsItem;
  locale: string;
  categoryLabel: string;
  pinnedLabel: string;
}) {
  return (
    <article className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[item.category]}`}
        >
          {categoryLabel}
        </span>
        {item.isPinned && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {pinnedLabel}
          </span>
        )}
        <span className="text-xs text-text-secondary ml-auto">
          {formatDate(item.date, locale)}
        </span>
      </div>
      <Link href={`/news/${item.slug}`} className="block group">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
          {item.title}
        </h3>
      </Link>
      {item.summary && (
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {item.summary}
        </p>
      )}
    </article>
  );
}

export default async function NewsPage({ params }: PageProps) {
  const { locale } = await params;
  const [news, t] = await Promise.all([
    getNews(),
    getTranslations({ locale, namespace: "news" }),
  ]);

  const categoryLabels: Record<BoardCategory, string> = {
    notice: t("categoryAnnouncement"),
    award: t("categoryAward"),
    event: t("categoryEvent"),
    acceptance: t("categoryConference"),
    recruitment: t("categoryGeneral"),
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
          {news.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3"
              >
                <path d="m3 11 18-5v12L3 14v-3z" />
                <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
              </svg>
              <p className="text-sm">{t("empty")}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {news.map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  locale={locale}
                  categoryLabel={categoryLabels[item.category]}
                  pinnedLabel={locale === "ko" ? "고정" : "Pinned"}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
