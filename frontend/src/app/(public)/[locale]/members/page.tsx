import { getTranslations } from "next-intl/server";
import { getProfessor, getStudents } from "@/lib/queries";
import { MembersPageClient } from "./MembersPageClient";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("membersTitle"), description: t("membersDescription") };
}

export default async function MembersPage({ params }: PageProps) {
  const { locale } = await params;
  const [professor, students] = await Promise.all([
    getProfessor(),
    getStudents(),
  ]);

  return (
    <MembersPageClient
      professor={professor}
      students={students}
      locale={locale}
    />
  );
}
