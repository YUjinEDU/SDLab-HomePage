interface TagBadgeProps {
  label: string;
  variant?: "default" | "primary" | "muted";
}

const variantStyles: Record<string, string> = {
  default: "text-text-secondary bg-surface px-2 py-0.5 rounded",
  primary:
    "bg-primary-muted text-primary px-2 py-0.5 rounded border border-primary-light/30",
  muted:
    "text-text-secondary/70 border border-border/60 px-2 py-0.5 rounded-full hover:border-primary/30 transition-colors",
};

export function TagBadge({ label, variant = "default" }: TagBadgeProps) {
  if (variant === "default" || variant === "muted") {
    return (
      <span
        className={`inline-flex items-center text-[11px] font-mono tracking-wide uppercase ${variantStyles[variant]}`}
      >
        #{label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center text-[11px] font-mono tracking-wide uppercase ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}
