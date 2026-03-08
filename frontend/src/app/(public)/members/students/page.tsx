import { getStudents } from "@/lib/queries";
import { StudentsPageClient } from "./StudentsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연구원 | 스마트데이터연구실",
  description: "스마트데이터연구실의 연구원을 소개합니다",
};

export default async function StudentsPage() {
  const students = await getStudents();

  return <StudentsPageClient students={students} />;
}
