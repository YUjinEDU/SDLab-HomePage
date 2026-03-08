import Link from "next/link";
import type { Publication } from "@/types/publication";
import type { Project } from "@/types/project";
import type { Member } from "@/types/member";

type Props = {
  areaId: string;
  publications: Publication[];
  projects: Project[];
  members?: Member[];
};

export function RelatedContentPreview({
  areaId,
  publications,
  projects,
  members,
}: Props) {
  const relatedPublications = publications.filter((p) =>
    p.researchAreaIds.includes(areaId),
  );
  const relatedProjects = projects.filter((p) =>
    p.researchAreaIds.includes(areaId),
  );
  // Find members who participate in projects of this research area
  const relatedProjectIds = relatedProjects.map((p) => p.id);
  const relatedMembers = members
    ? members.filter((m) =>
        projects.some(
          (p) => relatedProjectIds.includes(p.id) && p.memberIds.includes(m.id),
        ),
      )
    : [];

  const hasContent =
    relatedPublications.length > 0 ||
    relatedProjects.length > 0 ||
    relatedMembers.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
      {relatedMembers.length > 0 && (
        <Link
          href="/members"
          className="flex flex-col gap-1 rounded-lg border border-border bg-primary-muted/20 px-4 py-3 hover:bg-primary-muted/40 transition-colors"
        >
          <span className="text-2xl font-bold text-primary">
            {relatedMembers.length}
          </span>
          <span className="text-xs text-text-secondary">참여 연구원</span>
        </Link>
      )}
    </div>
  );
}
