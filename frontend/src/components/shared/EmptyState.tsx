import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 120 120"
        fill="none"
        className="mx-auto text-text-secondary/30 mb-6"
        aria-hidden="true"
      >
        {/* Box body */}
        <rect
          x="20"
          y="45"
          width="80"
          height="50"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        {/* Box flaps */}
        <path
          d="M20 45 L40 28 L60 42 L80 28 L100 45"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Dashed line inside box */}
        <line
          x1="40"
          y1="70"
          x2="80"
          y2="70"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 3"
          opacity="0.5"
        />
        <line
          x1="48"
          y1="80"
          x2="72"
          y2="80"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 3"
          opacity="0.35"
        />
      </svg>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && <p className="mt-2 text-text-secondary">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center mt-6 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
