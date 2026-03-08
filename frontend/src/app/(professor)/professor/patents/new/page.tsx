import { getMembers, getResearchAreas, getProjects } from "@/lib/queries";
import PublicationForm from "../../publications/PublicationForm";

export default async function NewPatentPage() {
  const [members, researchAreas, projects] = await Promise.all([
    getMembers(),
    getResearchAreas(),
    getProjects(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">특허 등록</h1>
      <PublicationForm
        members={members}
        researchAreas={researchAreas}
        projects={projects}
        defaultType="patent"
        defaultVenue="대한민국 특허청"
        redirectPath="/professor/patents"
      />
    </div>
  );
}
