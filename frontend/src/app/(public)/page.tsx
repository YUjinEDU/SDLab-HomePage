import type { Metadata } from "next";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { LabIntroSection } from "@/components/home/LabIntroSection";
import { ResearchAreasSection } from "@/components/home/ResearchAreasSection";
import { StatsBarSection } from "@/components/home/StatsBarSection";
import { FeaturedPublicationsSection } from "@/components/home/FeaturedPublicationsSection";
import { FeaturedProjectsSection } from "@/components/home/FeaturedProjectsSection";
import { MembersSnapshotSection } from "@/components/home/MembersSnapshotSection";
import { LatestNewsSection } from "@/components/home/LatestNewsSection";
import { ContactSummarySection } from "@/components/home/ContactSummarySection";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import {
  getMembers,
  getFeaturedPublications,
  getLatestNews,
  getPublications,
  getProjects,
  getContactInfo,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Smart Data Lab | 충남대학교 스마트데이터연구실",
  description:
    "충남대학교 컴퓨터인공지능학부 스마트데이터연구실. 실시간 스마트 컴퓨팅, 바이오AI융합, 환경IT융합 연구를 수행합니다.",
};

export default async function HomePage() {
  const [
    members,
    featuredPublications,
    latestNews,
    publications,
    projects,
    contactInfo,
  ] = await Promise.all([
    getMembers(),
    getFeaturedPublications(),
    getLatestNews(),
    getPublications(),
    getProjects(),
    getContactInfo(),
  ]);

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
        <FeaturedPublicationsSection
          publications={featuredPublications}
          members={members}
        />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <FeaturedProjectsSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <MembersSnapshotSection members={members} />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <LatestNewsSection
          news={latestNews}
          publications={publications}
          projects={projects}
        />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <ContactSummarySection contactInfo={contactInfo} />
      </AnimateOnScroll>
    </main>
  );
}
