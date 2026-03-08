import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { publications } from "@/data/publications";

const featured = publications.filter((p) => p.isFeatured).slice(0, 3);

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

        <div className="max-w-4xl mx-auto space-y-4">
          {featured.map((pub) => (
            <Link
              key={pub.id}
              href={`/publications/${pub.slug}`}
              className="card-hover block rounded-2xl border border-border bg-white p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-primary bg-primary-muted px-3 py-1 rounded-full uppercase">
                  {pub.type}
                </span>
                <span className="text-xs text-text-secondary">{pub.year}</span>
              </div>
              <h3 className="text-base font-bold text-foreground leading-snug mb-2">
                {pub.title}
              </h3>
              <p className="text-sm text-text-secondary">
                {pub.authors.join(", ")} — {pub.venue}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
