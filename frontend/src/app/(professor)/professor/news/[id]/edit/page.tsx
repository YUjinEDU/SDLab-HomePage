import { notFound } from "next/navigation";
import { getNewsById, getAllPublications, getProjects } from "@/lib/queries";
import NewsForm from "../../NewsForm";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [newsItem, projects, publications] = await Promise.all([
    getNewsById(id),
    getProjects(),
    getAllPublications(),
  ]);

  if (!newsItem) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">소식 수정</h1>
      <NewsForm
        newsItem={newsItem}
        projects={projects}
        publications={publications}
      />
    </div>
  );
}
