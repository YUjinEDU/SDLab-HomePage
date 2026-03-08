import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/layout/Container";
import { ResearchAreaDetailCard } from "@/components/research/ResearchAreaDetailCard";
import { RelatedContentPreview } from "@/components/research/RelatedContentPreview";
import { researchAreas } from "@/data/research-areas";
import { publications } from "@/data/publications";
import { projects } from "@/data/projects";

export const metadata = {
  title: "연구 분야 | 스마트데이터연구실",
  description:
    "스마트데이터연구실의 3대 핵심 연구 분야 — 실시간 스마트 컴퓨팅 응용, 바이오AI융합 연구, 환경IT융합 연구",
};

export default function ResearchPage() {
  const sortedAreas = [...researchAreas].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <>
      <PageHero
        title="연구 분야"
        description="스마트데이터연구실의 3대 핵심 연구 분야를 소개합니다"
      />

      <section className="py-16">
        <Container>
          <div className="flex flex-col gap-8">
            {sortedAreas.map((area) => (
              <ResearchAreaDetailCard key={area.id} area={area}>
                <RelatedContentPreview
                  areaId={area.id}
                  publications={publications}
                  projects={projects}
                />
              </ResearchAreaDetailCard>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
