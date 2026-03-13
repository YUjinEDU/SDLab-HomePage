import { Container } from "@/components/layout/Container";
import { labStats } from "@/data/stats";
import { getAlumniCount } from "@/lib/queries";

export async function LabIntroSection() {
  const alumniCount = await getAlumniCount();

  const stats = [
    ...labStats.slice(0, 1),
    { value: `${alumniCount}+`, label: "석박사 배출" },
    ...labStats.slice(1),
  ];

  return (
    <section className="py-24 lg:py-32 relative">
      <Container>
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            About the Lab
          </p>
          <h2 className="font-display text-3xl sm:text-[2.5rem] font-extrabold text-foreground mb-8 leading-tight">
            연구실 <span className="text-gradient">소개</span>
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-[1.85] max-w-3xl">
            스마트데이터연구실은 데이터와 인공지능 기술을 기반으로 다양한 산업
            및 사회 문제를 해결하는 연구를 수행하고 있습니다. 실시간 스마트
            컴퓨팅, 바이오AI융합, 환경IT융합을 핵심 축으로 하여, 실제 응용
            가능한 기술 개발과 문제 해결 중심의 연구를 지향합니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white rounded-xl p-6 border border-border"
            >
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
