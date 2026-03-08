import type { Publication } from "@/types";

type PublicationStatsPanelProps = {
  publications: Publication[];
};

export function PublicationStatsPanel({
  publications,
}: PublicationStatsPanelProps) {
  const total = publications.length;
  const journalCount = publications.filter((p) => p.type === "journal").length;
  const conferenceCount = publications.filter(
    (p) => p.type === "conference",
  ).length;

  const years = publications.map((p) => p.year);
  const minYear = years.length > 0 ? Math.min(...years) : null;
  const maxYear = years.length > 0 ? Math.max(...years) : null;
  const yearRange =
    minYear && maxYear
      ? minYear === maxYear
        ? `${minYear}`
        : `${minYear} – ${maxYear}`
      : "-";

  const stats = [
    { label: "전체 논문", value: total },
    { label: "저널", value: journalCount },
    { label: "학술대회", value: conferenceCount },
    { label: "연구 기간", value: yearRange },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface px-6 py-4">
      <dl className="flex flex-wrap gap-x-8 gap-y-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="flex items-baseline gap-2">
            <dt className="text-sm text-text-secondary">{label}</dt>
            <dd className="text-lg font-semibold text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
