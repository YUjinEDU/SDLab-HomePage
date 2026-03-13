import { getProfessor, getStudents } from "@/lib/queries";
import { MembersPageClient } from "./MembersPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "구성원 | 스마트데이터연구실",
  description: "스마트데이터연구실의 지도교수 및 연구원을 소개합니다",
};

export default async function MembersPage() {
  const [professor, students] = await Promise.all([
    getProfessor(),
    getStudents(),
  ]);

  return <MembersPageClient professor={professor} students={students} />;
}
