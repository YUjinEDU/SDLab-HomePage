import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/layout/Container";
import { ResearchAreaDetailCard } from "@/components/research/ResearchAreaDetailCard";
import { RelatedContentPreview } from "@/components/research/RelatedContentPreview";
import {
  getResearchAreas,
  getProjects,
  getPublications,
  getMembers,
} from "@/lib/queries";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("researchTitle"), description: t("researchDescription") };
}

export default async function ResearchPage({ params }: PageProps) {
  const { locale } = await params;
  const [researchAreas, projects, publications, members, t] = await Promise.all(
    [
      getResearchAreas(),
      getProjects(),
      getPublications(),
      getMembers(),
      getTranslations({ locale, namespace: "research" }),
    ],
  );

  const sortedAreas = [...researchAreas].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <>
      <PageHero
        title={t("heading") + " " + t("headingHighlight")}
        description={t("sectionLabel")}
        breadcrumb={t("heading")}
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
                  members={members}
                />
              </ResearchAreaDetailCard>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
