import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { LabIntroSection } from "@/components/home/LabIntroSection";
import { ResearchAreasSection } from "@/components/home/ResearchAreasSection";
import { FeaturedPublicationsSection } from "@/components/home/FeaturedPublicationsSection";
import { FeaturedProjectsSection } from "@/components/home/FeaturedProjectsSection";
import { MembersSnapshotSection } from "@/components/home/MembersSnapshotSection";
import { LatestNewsSection } from "@/components/home/LatestNewsSection";
import { ContactSummarySection } from "@/components/home/ContactSummarySection";

export default function HomePage() {
  return (
    <main>
      <HomeHeroSection />
      <LabIntroSection />
      <ResearchAreasSection />
      <FeaturedPublicationsSection />
      <FeaturedProjectsSection />
      <MembersSnapshotSection />
      <LatestNewsSection />
      <ContactSummarySection />
    </main>
  );
}
