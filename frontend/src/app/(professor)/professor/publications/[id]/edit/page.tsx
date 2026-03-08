import { notFound } from "next/navigation";
import {
  getPublicationById,
  getMembers,
  getResearchAreas,
  getProjects,
} from "@/lib/queries";
import PublicationForm from "../../PublicationForm";

export default async function EditPublicationPage({
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

  if (!publication) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">논문 수정</h1>
      <PublicationForm
        publication={publication}
        members={members}
        researchAreas={researchAreas}
        projects={projects}
      />
    </div>
  );
}
