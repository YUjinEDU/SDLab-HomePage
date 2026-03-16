import { getTranslations } from "next-intl/server";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { LabIntroSection } from "@/components/home/LabIntroSection";
import { ResearchAreasSection } from "@/components/home/ResearchAreasSection";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

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
        <LatestNewsSection
          news={latestNews}
          publications={publications}
          projects={projects}
        />
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
        <ContactSummarySection contactInfo={contactInfo} />
      </AnimateOnScroll>
    </main>
  );
}
