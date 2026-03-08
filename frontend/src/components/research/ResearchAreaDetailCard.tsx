import Link from "next/link";
import type { ResearchArea } from "@/types";
import { TagBadge } from "@/components/shared/TagBadge";

function AreaIcon({ icon }: { icon: string }) {
  const cls = "w-10 h-10 text-primary";
  switch (icon) {
    case "cpu":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cls}
        >
          <rect width="16" height="16" x="4" y="4" rx="2" />
          <rect width="6" height="6" x="9" y="9" rx="1" />
          <path d="M15 2v2" />
          <path d="M15 20v2" />
          <path d="M2 15h2" />
          <path d="M2 9h2" />
          <path d="M20 15h2" />
          <path d="M20 9h2" />
          <path d="M9 2v2" />
          <path d="M9 20v2" />
        </svg>
      );
    case "dna":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cls}
        >
          <path d="M2 15c6.667-6 13.333 0 20-6" />
          <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
          <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
          <path d="m17 6-2.5-2.5" />
          <path d="m14 8-1-1" />
          <path d="m7 18 2.5 2.5" />
          <path d="m3.5 14.5.5.5" />
          <path d="m20 9 .5.5" />
          <path d="m6.5 12.5 1 1" />
          <path d="m16.5 10.5 1 1" />
          <path d="m10 16 1.5 1.5" />
        </svg>
      );
    case "leaf":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cls}
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cls}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      );
  }
}

type Props = {
  area: ResearchArea;
  children?: React.ReactNode;
};

export function ResearchAreaDetailCard({ area, children }: Props) {
  return (
    <article className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 p-2 rounded-lg bg-primary-muted"
          aria-hidden="true"
        >
          <AreaIcon icon={area.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-extrabold text-foreground">
            {area.title}
          </h2>
          <p className="mt-2 text-text-secondary leading-relaxed">
            {area.fullDescription}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-2">핵심 키워드</h3>
        <div className="flex flex-wrap gap-2">
          {area.keywords.map((keyword) => (
            <TagBadge key={keyword} label={keyword} variant="primary" />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-2">응용 분야</h3>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {area.applications.map((app) => (
            <li
              key={app}
              className="text-sm text-text-secondary flex items-center gap-1.5"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0"
                aria-hidden="true"
              />
              {app}
            </li>
          ))}
        </ul>
      </div>

      {children && <div>{children}</div>}

      <div className="flex gap-4 pt-2 border-t border-border">
        <Link
          href={`/publications?area=${area.id}`}
          className="text-sm font-bold text-primary hover:text-primary-light transition-colors"
        >
          관련 논문 보기 &rarr;
        </Link>
        <Link
          href={`/projects?area=${area.id}`}
          className="text-sm font-bold text-primary hover:text-primary-light transition-colors"
        >
          관련 프로젝트 보기 &rarr;
        </Link>
      </div>
    </article>
  );
}
