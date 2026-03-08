interface StatusBadgeProps {
  status: "active" | "completed" | "planned" | "archived";
}

const statusConfig: Record<
  string,
  { label: string; dotClass: string; className: string }
> = {
  active: {
    label: "진행중",
    dotClass: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  completed: {
    label: "완료",
    dotClass: "bg-slate-400",
    className: "bg-slate-50 text-slate-600 border border-slate-200",
  },
  planned: {
    label: "예정",
    dotClass: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  archived: {
    label: "보관",
    dotClass: "bg-slate-300",
    className: "bg-slate-50 text-slate-400 border border-slate-200",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${config.className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`}
      />
      {config.label}
    </span>
  );
}
