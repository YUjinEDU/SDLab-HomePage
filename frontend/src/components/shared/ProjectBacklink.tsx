import { Link } from "@/i18n/navigation";
import type { Project } from "@/types";

type Props = {
  projects: Project[];
  label: string;
};

export function ProjectBacklink({ projects, label }: Props) {
  if (projects.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">{label}</h2>
      <div className="flex flex-col gap-3">
        {projects.map((proj) => (
          <Link
            key={proj.id}
            href={`/projects/${proj.slug}`}
            className="rounded-xl border border-border bg-surface p-4 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground mb-1 break-words">
                  {proj.title}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {proj.shortDescription}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-text-secondary mt-0.5"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
