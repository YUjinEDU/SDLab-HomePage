import { getAllPublications, getProjects } from "@/lib/queries";
import NewsForm from "../NewsForm";

export default async function NewNewsPage() {
  const [projects, publications] = await Promise.all([
    getProjects(),
    getAllPublications(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">소식 등록</h1>
      <NewsForm projects={projects} publications={publications} />
    </div>
  );
}
