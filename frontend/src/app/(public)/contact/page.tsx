import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/layout/Container";
import { ContactInfoCard } from "@/components/contact/ContactInfoCard";
import { MapSection } from "@/components/contact/MapSection";
import { DirectionsSection } from "@/components/contact/DirectionsSection";
import { contactInfo } from "@/data/contact";

export const metadata = {
  title: "연락처 | 스마트데이터연구실",
  description: "충남대학교 스마트데이터연구실 위치 및 연락처 안내",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="연락처"
        description="스마트데이터연구실 위치 및 연락처 안내"
      />

      <section className="py-16">
        <Container>
          <div className="flex flex-col gap-8">
            <ContactInfoCard info={contactInfo} />
            <MapSection
              address={contactInfo.address}
              embedUrl={contactInfo.mapEmbedUrl}
            />
            <DirectionsSection
              address={contactInfo.address}
              building={contactInfo.location.building}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
