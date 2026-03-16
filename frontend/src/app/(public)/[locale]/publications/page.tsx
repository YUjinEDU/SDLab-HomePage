import { getTranslations } from "next-intl/server";
import { getPublications, getMemberStubs } from "@/lib/queries";
import { PublicationsPageClient } from "./PublicationsPageClient";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("publicationsTitle"),
    description: t("publicationsDescription"),
  };
}

export default async function PublicationsPage() {
  const [publications, members] = await Promise.all([
    getPublications(),
    getMemberStubs(),
  ]);
  return (
    <PublicationsPageClient publications={publications} members={members} />
  );
}
