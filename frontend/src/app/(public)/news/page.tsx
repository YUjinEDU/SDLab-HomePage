import Link from "next/link";
import { getNews } from "@/lib/queries";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/shared/PageHero";
import type { NewsItem, BoardCategory } from "@/types";

export const metadata = {
  title: "소식 | 스마트데이터연구실",
  description: "스마트데이터연구실의 최신 소식을 전합니다",
};

const categoryLabels: Record<BoardCategory, string> = {
  notice: "공지",
  award: "수상",
  event: "행사",
  acceptance: "논문 게재",
  recruitment: "모집",
};

const categoryColors: Record<BoardCategory, string> = {
  notice: "bg-blue-100 text-blue-700",
  award: "bg-amber-100 text-amber-700",
  event: "bg-violet-100 text-violet-700",
  acceptance: "bg-green-100 text-green-700",
  recruitment: "bg-rose-100 text-rose-700",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[item.category]}`}
        >
          {categoryLabels[item.category]}
        </span>
        {item.isPinned && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            고정
          </span>
        )}
        <span className="text-xs text-text-secondary ml-auto">
          {formatDate(item.date)}
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

export default async function NewsPage() {
  const news = await getNews();

  return (
    <>
      <PageHero
        title="소식"
        description="스마트데이터연구실의 최신 소식을 전합니다"
        breadcrumb="소식"
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
              <p className="text-sm">등록된 소식이 없습니다</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {news.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
