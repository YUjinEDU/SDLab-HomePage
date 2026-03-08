import { Container } from "@/components/layout/Container";

const stats = [
  { value: "1996", label: "연구실 설립" },
  { value: "3", label: "핵심 연구 분야" },
  { value: "79+", label: "석박사 배출" },
  { value: "14", label: "기술이전 건수" },
];

export function StatsBarSection() {
  return (
    <section className="py-14 bg-surface border-y border-border">
      <Container>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-text-secondary mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
