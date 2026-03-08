import { getPatents } from "@/lib/queries";
import { PatentsPageClient } from "./PatentsPageClient";

export const metadata = {
  title: "특허 | 스마트데이터연구실",
  description: "스마트데이터연구실의 등록 및 출원 특허 목록",
};

export default async function PatentsPage() {
  const patents = await getPatents();
  return <PatentsPageClient patents={patents} />;
}
