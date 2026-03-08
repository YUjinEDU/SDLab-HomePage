import { getMembers, getResearchAreas, getProjects } from "@/lib/queries";
import PublicationForm from "../PublicationForm";

export default async function NewPublicationPage() {
  const [members, researchAreas, projects] = await Promise.all([
    getMembers(),
    getResearchAreas(),
    getProjects(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">논문 등록</h1>
      <PublicationForm
        members={members}
        researchAreas={researchAreas}
        projects={projects}
      />
    </div>
  );
}
