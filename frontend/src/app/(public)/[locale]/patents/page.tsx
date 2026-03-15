import { getTranslations } from "next-intl/server";
import { getPatents } from "@/lib/queries";
import { PatentsPageClient } from "./PatentsPageClient";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("patentsTitle"),
    description: t("patentsDescription"),
  };
}

export default async function PatentsPage() {
  const patents = await getPatents();
  return <PatentsPageClient patents={patents} />;
}
