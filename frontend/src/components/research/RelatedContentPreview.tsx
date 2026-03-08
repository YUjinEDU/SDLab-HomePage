import Link from "next/link";
import type { Publication } from "@/types/publication";
import type { Project } from "@/types/project";

type Props = {
  areaId: string;
  publications: Publication[];
  projects: Project[];
};

export function RelatedContentPreview({
  areaId,
  publications,
  projects,
}: Props) {
  const relatedPublications = publications.filter((p) =>
    p.researchAreaIds.includes(areaId),
  );
  const relatedProjects = projects.filter((p) =>
    p.researchAreaIds.includes(areaId),
  );

  const hasContent =
    relatedPublications.length > 0 || relatedProjects.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {relatedPublications.length > 0 && (
        <Link
          href={`/publications?area=${areaId}`}
          className="flex flex-col gap-1 rounded-lg border border-border bg-primary-muted/20 px-4 py-3 hover:bg-primary-muted/40 transition-colors"
        >
          <span className="text-2xl font-bold text-primary">
            {relatedPublications.length}
          </span>
          <span className="text-xs text-text-secondary">관련 논문</span>
        </Link>
      )}
      {relatedProjects.length > 0 && (
        <Link
          href={`/projects?area=${areaId}`}
          className="flex flex-col gap-1 rounded-lg border border-border bg-primary-muted/20 px-4 py-3 hover:bg-primary-muted/40 transition-colors"
        >
          <span className="text-2xl font-bold text-primary">
            {relatedProjects.length}
          </span>
          <span className="text-xs text-text-secondary">관련 프로젝트</span>
        </Link>
      )}
    </div>
  );
}
