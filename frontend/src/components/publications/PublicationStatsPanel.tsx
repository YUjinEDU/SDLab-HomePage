import type { Publication } from "@/types";

type PublicationStatsPanelProps = {
  publications: Publication[];
};

export function PublicationStatsPanel({
  publications,
}: PublicationStatsPanelProps) {
  const total = publications.length;
  const intlJournal = publications.filter(
    (p) => p.type === "journal" && p.isInternational,
  ).length;
  const domJournal = publications.filter(
    (p) => p.type === "journal" && !p.isInternational,
  ).length;
  const intlConf = publications.filter(
    (p) => p.type === "conference" && p.isInternational,
  ).length;
  const domConf = publications.filter(
    (p) => p.type === "conference" && !p.isInternational,
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
    { label: "전체", value: total },
    { label: "국제 저널", value: intlJournal },
    { label: "국내 저널", value: domJournal },
    { label: "국제 학술대회", value: intlConf },
    { label: "국내 학술대회", value: domConf },
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
