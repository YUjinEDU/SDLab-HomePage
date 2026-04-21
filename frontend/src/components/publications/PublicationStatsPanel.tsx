"use client";

import { useTranslations } from "next-intl";
import type { Publication } from "@/types";

type PublicationStatsPanelProps = {
  publications: Publication[];
};

export function PublicationStatsPanel({
  publications,
}: PublicationStatsPanelProps) {
  const t = useTranslations("publications");

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
  const swReg = publications.filter((p) => p.type === "sw_registration").length;

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
    { label: t("statsTotal"), value: total },
    { label: `${t("statsIntl")} ${t("statsJournal")}`, value: intlJournal },
    { label: `${t("statsDom")} ${t("statsJournal")}`, value: domJournal },
    { label: `${t("statsIntl")} ${t("statsConference")}`, value: intlConf },
    { label: `${t("statsDom")} ${t("statsConference")}`, value: domConf },
    { label: t("typeSW"), value: swReg },
    { label: t("statsRecent"), value: yearRange },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface px-6 py-4">
      <dl className="flex flex-wrap gap-x-4 sm:gap-x-8 gap-y-3">
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
