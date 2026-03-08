import { Container } from "@/components/layout/Container";

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

        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-text-secondary">소식이 준비 중입니다.</p>
        </div>
      </Container>
    </section>
  );
}
