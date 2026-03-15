"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Publication } from "@/types";
import { TagBadge } from "@/components/shared/TagBadge";
import { members } from "@/data/members";

type PatentCardProps = {
  patent: Publication;
};

function getPatentStatus(doi: string | null): "registered" | "applied" {
  // 등록번호: 10-1xxxxxx (7자리 숫자) / 출원번호: 10-2024-xxxxxxx (연도 포함 대시)
  if (!doi) return "applied";
  return /^10-1\d{6,}/.test(doi.replace(/\s/g, "")) ? "registered" : "applied";
}

export function PatentCard({ patent }: PatentCardProps) {
  const t = useTranslations("patents");

  const { slug, title, authors, venue, year, month, doi, keywords } = patent;
  const status = getPatentStatus(doi);

  const venueDate =
    month != null ? `${venue}, ${year}.${month}` : `${venue}, ${year}`;

  return (
    <article className="rounded-xl border border-border bg-white p-4 sm:p-6 card-hover group flex flex-col h-full relative">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-200">
            {t("labelPatent")}
          </span>
          {status === "registered" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-green-50 text-green-700 border border-green-200">
              {t("statusRegistered")}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
              {t("statusApplied")}
            </span>
          )}
        </div>
        <span className="text-sm text-text-secondary font-semibold font-mono bg-surface px-2 py-0.5 rounded">
          {year}
        </span>
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
            {authors.map((author, idx) => {
              const matchedMember = members.find(
                (m) => m.nameEn === author || m.nameKo === author,
              );
              return (
                <span key={idx}>
                  {idx > 0 && ", "}
                  {matchedMember ? (
                    <Link
                      href={`/members/${matchedMember.slug}`}
                      className="text-primary hover:text-primary-dark transition-colors relative z-10"
                    >
                      {author}
                    </Link>
                  ) : (
                    author
                  )}
                </span>
              );
            })}
          </span>
        </p>

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
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span className="truncate min-w-0">{venueDate}</span>
        </p>

        {doi && (
          <p className="text-[12px] text-text-secondary font-mono mb-3">
            {status === "registered"
              ? t("labelRegistrationNo")
              : t("labelApplicationNo")}
            : {doi}
          </p>
        )}

        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 relative z-10">
            {keywords.map((kw) => (
              <TagBadge key={kw} label={kw} variant="muted" />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
