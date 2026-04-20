import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/layout/Container";
import { ContactInfoCard } from "@/components/contact/ContactInfoCard";
import { MapSection } from "@/components/contact/MapSection";
import { DirectionsSection } from "@/components/contact/DirectionsSection";
import { getContactInfo } from "@/lib/queries";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("contactTitle"), description: t("contactDescription") };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const [contactInfo, t] = await Promise.all([
    getContactInfo(),
    getTranslations({ locale, namespace: "contact" }),
  ]);

  return (
    <>
      <PageHero
        title={t("pageTitle")}
        description={t("pageDescription")}
        breadcrumb={t("pageTitle")}
      />

      <section className="py-16">
        <Container>
          <div className="flex flex-col gap-8">
            {contactInfo ? (
              <>
                <ContactInfoCard info={contactInfo} />
                <MapSection
                  address={contactInfo.address}
                  embedUrl={contactInfo.mapEmbedUrl}
                />
                <DirectionsSection
                  address={contactInfo.address}
                  building={contactInfo.location.building}
                />
              </>
            ) : (
              <p className="text-center text-gray-500 py-16">연락처 정보를 준비 중입니다.</p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
