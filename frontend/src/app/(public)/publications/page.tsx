import { getPublications } from "@/lib/queries";
import { PublicationsPageClient } from "./PublicationsPageClient";

export const metadata = {
  title: "논문 | 스마트데이터연구실",
  description: "스마트데이터연구실의 연구 논문 목록",
};

export default async function PublicationsPage() {
  const publications = await getPublications();
  return <PublicationsPageClient publications={publications} />;
}
