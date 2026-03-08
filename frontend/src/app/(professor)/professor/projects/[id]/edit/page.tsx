import { notFound } from "next/navigation";
import { getProjectById, getMembers, getResearchAreas } from "@/lib/queries";
import ProjectForm from "../../ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, members, researchAreas] = await Promise.all([
    getProjectById(id),
    getMembers(),
    getResearchAreas(),
  ]);

  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">프로젝트 수정</h1>
      <ProjectForm
        project={project}
        members={members}
        researchAreas={researchAreas}
      />
    </div>
  );
}
