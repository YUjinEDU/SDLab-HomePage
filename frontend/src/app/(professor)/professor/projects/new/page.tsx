import { getMembers, getResearchAreas } from "@/lib/queries";
import ProjectForm from "../ProjectForm";

export default async function NewProjectPage() {
  const [members, researchAreas] = await Promise.all([
    getMembers(),
    getResearchAreas(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">프로젝트 등록</h1>
      <ProjectForm members={members} researchAreas={researchAreas} />
    </div>
  );
}
