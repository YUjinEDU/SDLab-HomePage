"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Patent } from "@/types";
import { members } from "@/data/members";

type PatentCardProps = {
  patent: Patent;
};

export function PatentCard({ patent }: PatentCardProps) {
  const t = useTranslations("patents");

  const { slug, title, inventors, status, patentNumber, date } = patent;

  // Extract year from date field (format: "YYYY-MM-DD")
  const year = date ? date.slice(0, 4) : null;

  return (
    <article className="rounded-xl border border-border bg-white p-4 sm:p-6 card-hover group flex flex-col h-full relative">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-200">
            {t("labelPatent")}
          </span>
          {status === "등록" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-green-50 text-green-700 border border-green-200">
              {t("statusRegistered")}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
              {t("statusApplied")}
            </span>
          )}
        </div>
        {year && (
          <span className="text-sm text-text-secondary font-semibold font-mono bg-surface px-2 py-0.5 rounded">
            {year}
          </span>
        )}
      </div>

      <h3 className="text-[1.05rem] font-bold text-foreground leading-snug mb-3 pr-4 group-hover:text-primary transition-colors break-words min-w-0">
        <Link
          href={`/patents/${slug}`}
          className="before:absolute before:inset-0"
        >
          {title}
        </Link>
      </h3>

      <div className="mt-auto pt-2">
        <p className="text-[13px] text-text-secondary font-medium leading-relaxed mb-1.5 flex items-center gap-2 min-w-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 opacity-70"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="truncate min-w-0">
            {inventors.map((inventor, idx) => {
              const matchedMember = members.find(
                (m) => m.nameEn === inventor || m.nameKo === inventor,
              );
              return (
                <span key={idx}>
                  {idx > 0 && ", "}
                  {matchedMember ? (
                    <Link
                      href={`/members/${matchedMember.slug}`}
                      className="text-primary hover:text-primary-dark transition-colors relative z-10"
                    >
                      {inventor}
                    </Link>
                  ) : (
                    inventor
                  )}
                </span>
              );
            })}
          </span>
        </p>

        {date && (
          <p className="text-[13px] text-text-secondary font-medium mb-5 flex items-center gap-2 min-w-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 opacity-70"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span className="truncate min-w-0">{date}</span>
          </p>
        )}

        {patentNumber && (
          <p className="text-[12px] text-text-secondary font-mono mb-3">
            {status === "등록"
              ? t("labelRegistrationNo")
              : t("labelApplicationNo")}
            : {patentNumber}
          </p>
        )}
      </div>
    </article>
  );
}
