import { Container } from "@/components/layout/Container";
import { labStats } from "@/data/stats";

export function StatsBarSection() {
  return (
    <section className="py-14 bg-surface border-y border-border">
      <Container>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {labStats.map((stat) => (
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
