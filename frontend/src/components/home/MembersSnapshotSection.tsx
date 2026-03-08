import Link from "next/link";
import { members } from "@/data/members";
import { Container } from "@/components/layout/Container";

const groupLabel: Record<string, string> = {
  phd: "박사과정",
  ms: "석사과정",
  combined: "석박통합과정",
  undergraduate: "학부연구생",
  alumni: "졸업생",
};

export function MembersSnapshotSection() {
  const others = members.filter((m) => m.group !== "professor");

  const groupCounts = others.reduce<Record<string, number>>((acc, m) => {
    acc[m.group] = (acc[m.group] ?? 0) + 1;
    return acc;
  }, {});

  const summary = Object.entries(groupCounts)
    .map(([group, count]) => `${groupLabel[group] ?? group} ${count}명`)
    .join(", ");

  return (
    <section className="py-24 lg:py-32">
      <Container>
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            Members
          </p>
          <h2 className="font-display text-3xl sm:text-[2.5rem] font-extrabold text-foreground mb-6 leading-tight">
            <span className="text-gradient">구성원</span>
          </h2>
          <p className="text-base text-text-secondary leading-relaxed">
            지도교수 김영국 외{" "}
            <span className="text-foreground font-semibold">{summary}</span>으로
            구성되어 있습니다.
          </p>
          <div className="mt-8">
            <Link
              href="/members"
              className="inline-flex items-center gap-2.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
            >
              구성원 전체 보기
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
