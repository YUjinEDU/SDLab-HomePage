import { notFound } from "next/navigation";
import {
  getPublicationById,
  getMembers,
  getResearchAreas,
  getProjects,
} from "@/lib/queries";
import PublicationForm from "../../../publications/PublicationForm";

export default async function EditPatentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [publication, members, researchAreas, projects] = await Promise.all([
    getPublicationById(id),
    getMembers(),
    getResearchAreas(),
    getProjects(),
  ]);

  if (!publication || publication.type !== "patent") notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">특허 수정</h1>
      <PublicationForm
        publication={publication}
        members={members}
        researchAreas={researchAreas}
        projects={projects}
        redirectPath="/professor/patents"
      />
    </div>
  );
}
