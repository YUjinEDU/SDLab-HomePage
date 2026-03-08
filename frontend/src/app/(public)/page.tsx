import type { Metadata } from "next";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";

export const metadata: Metadata = {
  title: "Smart Data Lab | 충남대학교 스마트데이터연구실",
  description:
    "충남대학교 컴퓨터융합학부 스마트데이터연구실. 실시간 스마트 컴퓨팅, 바이오AI융합, 환경IT융합 연구를 수행합니다.",
};
import { LabIntroSection } from "@/components/home/LabIntroSection";
import { ResearchAreasSection } from "@/components/home/ResearchAreasSection";
import { StatsBarSection } from "@/components/home/StatsBarSection";
import { FeaturedPublicationsSection } from "@/components/home/FeaturedPublicationsSection";
import { FeaturedProjectsSection } from "@/components/home/FeaturedProjectsSection";
import { MembersSnapshotSection } from "@/components/home/MembersSnapshotSection";
import { LatestNewsSection } from "@/components/home/LatestNewsSection";
import { ContactSummarySection } from "@/components/home/ContactSummarySection";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

export default function HomePage() {
  return (
    <main>
      <HomeHeroSection />
      <AnimateOnScroll>
        <LabIntroSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <ResearchAreasSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <StatsBarSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <FeaturedPublicationsSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <FeaturedProjectsSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <MembersSnapshotSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <LatestNewsSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <ContactSummarySection />
      </AnimateOnScroll>
    </main>
  );
}
