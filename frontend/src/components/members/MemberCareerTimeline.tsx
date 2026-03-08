import type { Member } from "@/types";

type Props = {
  career: Member["career"];
};

export function MemberCareerTimeline({ career }: Props) {
  if (career.length === 0) return null;

  return (
    <div className="relative">
      <div
        className="absolute left-3 top-2 bottom-2 w-px bg-border"
        aria-hidden="true"
      />
      <ul className="space-y-5">
        {career.map((entry, idx) => (
          <li key={idx} className="relative pl-9">
            <span className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-primary-muted border-2 border-primary flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-primary" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {entry.role}
              </p>
              <p className="text-sm text-text-secondary">
                {entry.organization}
              </p>
              <p className="text-xs text-text-secondary/70 mt-0.5">
                {entry.period}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
