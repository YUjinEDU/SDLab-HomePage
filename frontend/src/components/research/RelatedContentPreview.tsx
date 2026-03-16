import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Publication } from "@/types/publication";
import type { Project } from "@/types/project";
import type { Member } from "@/types/member";

type Props = {
  areaId: string;
  publications: Publication[];
  projects: Project[];
  members?: Member[];
};

export async function RelatedContentPreview({
  areaId,
  publications,
  projects,
  members,
}: Props) {
  const t = await getTranslations("research");
  const tMembers = await getTranslations("members");

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {relatedPublications.length > 0 && (
        <Link
          href={`/publications?area=${areaId}`}
          className="flex flex-col gap-1 rounded-lg border border-border bg-primary-muted/20 px-4 py-3 hover:bg-primary-muted/40 transition-colors"
        >
          <span className="text-2xl font-bold text-primary">
            {relatedPublications.length}
          </span>
          <span className="text-xs text-text-secondary">
            {t("relatedPapers")}
          </span>
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
          <span className="text-xs text-text-secondary">
            {t("relatedProjects")}
          </span>
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
          <span className="text-xs text-text-secondary">
            {tMembers("pageTitle")}
          </span>
        </Link>
      )}
    </div>
  );
}
