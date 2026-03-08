import { getProjects } from "@/lib/queries";
import { ProjectsPageClient } from "./ProjectsPageClient";

export const metadata = {
  title: "프로젝트 | 스마트데이터연구실",
  description: "스마트데이터연구실의 연구 프로젝트",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsPageClient projects={projects} />;
}
