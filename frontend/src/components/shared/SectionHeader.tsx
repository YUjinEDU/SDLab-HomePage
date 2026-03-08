import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  showDivider?: boolean;
}

export function SectionHeader({
  title,
  description,
  actionLabel,
  actionHref,
  showDivider = false,
}: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="mt-1.5 text-text-secondary text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0 ml-4"
          >
            {actionLabel}
          </Link>
        )}
      </div>
      {showDivider && <div className="mt-4 h-px bg-border" />}
    </div>
  );
}
