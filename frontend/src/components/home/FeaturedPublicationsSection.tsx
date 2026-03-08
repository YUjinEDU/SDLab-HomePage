import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function FeaturedPublicationsSection() {
  return (
    <section className="py-24 lg:py-32 bg-surface">
      <Container>
        <div className="max-w-4xl mx-auto mb-14">
          <p className="font-display text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            Publications
          </p>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl sm:text-[2.5rem] font-extrabold text-foreground leading-tight">
              대표 <span className="text-gradient">논문</span>
            </h2>
            <Link
              href="/publications"
              className="text-sm font-bold text-primary hover:text-primary-dark transition-colors"
            >
              전체 보기
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-text-secondary">
            대표 논문 목록이 곧 업데이트됩니다.
          </p>
        </div>
      </Container>
    </section>
  );
}
