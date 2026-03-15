import { Link } from "@/i18n/navigation";
import type { Project } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TagBadge } from "@/components/shared/TagBadge";

type ProjectCardProps = {
  project: Project;
  presentLabel?: string;
};

function formatPeriod(
  startDate: string,
  endDate: string | null,
  presentLabel: string,
): string {
  const formatDate = (d: string) => {
    const [year, month] = d.split("-");
    return `${year}.${month.padStart(2, "0")}`;
  };
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : presentLabel;
  return `${start} ~ ${end}`;
}

export function ProjectCard({
  project,
  presentLabel = "현재",
}: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-border bg-white p-6 card-hover group flex flex-col h-full relative">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="shrink-0 relative z-10">
          <StatusBadge status={project.status} />
        </div>
        {project.category && (
          <span className="text-[11px] font-semibold text-text-secondary tracking-wide uppercase bg-surface px-2 py-0.5 rounded">
            {project.category}
          </span>
        )}
      </div>

      <h3 className="text-[1.1rem] font-bold text-foreground leading-snug mb-3 pr-2 group-hover:text-primary transition-colors break-words min-w-0">
        <Link
          href={`/projects/${project.slug}`}
          className="before:absolute before:inset-0"
        >
          {project.title}
        </Link>
      </h3>

      <div className="flex flex-col gap-1.5 mb-4 bg-surface/50 rounded-lg p-3">
        <p className="text-sm font-semibold text-primary flex items-center gap-2 min-w-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 opacity-80"
          >
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M12 6h.01" />
            <path d="M12 10h.01" />
            <path d="M12 14h.01" />
            <path d="M16 10h.01" />
            <path d="M16 14h.01" />
            <path d="M8 10h.01" />
            <path d="M8 14h.01" />
          </svg>
          <span className="truncate min-w-0">{project.organization}</span>
        </p>
        <p className="text-xs font-mono text-text-secondary flex items-center gap-2 min-w-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 opacity-70"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          {formatPeriod(project.startDate, project.endDate, presentLabel)}
        </p>
      </div>

      <p className="text-[13px] text-text-secondary leading-relaxed flex-1 mb-5">
        {project.shortDescription}
      </p>

      {project.memberIds.length > 0 && (
        <p className="text-xs text-text-secondary mb-3 flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-60"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          참여 연구원 {project.memberIds.length}명
        </p>
      )}

      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto relative z-10 min-w-0">
          {project.tags.map((tag) => (
            <TagBadge key={tag} label={tag} variant="muted" />
          ))}
        </div>
      )}
    </article>
  );
}
