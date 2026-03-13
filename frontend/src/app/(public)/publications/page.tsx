import { getPublications, getMemberStubs } from "@/lib/queries";
import { PublicationsPageClient } from "./PublicationsPageClient";

export const metadata = {
  title: "논문 | 스마트데이터연구실",
  description: "스마트데이터연구실의 연구 논문 목록",
};

export default async function PublicationsPage() {
  const [publications, members] = await Promise.all([
    getPublications(),
    getMemberStubs(),
  ]);
  return (
    <PublicationsPageClient publications={publications} members={members} />
  );
}
