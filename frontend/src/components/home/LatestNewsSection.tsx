import { Container } from "@/components/layout/Container";
import { newsItems } from "@/data/news";

const categoryLabel: Record<string, string> = {
  acceptance: "논문 게재",
  award: "수상",
  recruitment: "모집",
  event: "행사",
};

const latestNews = [...newsItems]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 4);

export function LatestNewsSection() {
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
          {latestNews.map((item) => (
            <div
              key={item.id}
              className="card-hover rounded-2xl border border-border bg-white p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-primary bg-primary-muted px-3 py-1 rounded-full">
                  {categoryLabel[item.category] ?? item.category}
                </span>
                <time className="text-xs text-text-secondary">{item.date}</time>
                {item.isPinned && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    고정
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-foreground leading-snug mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
