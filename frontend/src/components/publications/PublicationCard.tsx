import Link from "next/link";
import type { Publication } from "@/types";
import type { Member } from "@/types";
import { TagBadge } from "@/components/shared/TagBadge";

function getTypeLabel(type: string, isInternational: boolean): string {
  if (type === "journal") return isInternational ? "국제 저널" : "국내 저널";
  if (type === "conference")
    return isInternational ? "국제 학술대회" : "국내 학술대회";
  const labels: Record<string, string> = {
    patent: "특허",
    thesis: "학위논문",
    report: "보고서",
  };
  return labels[type] ?? type;
}

function getTypeStyle(type: string, isInternational: boolean): string {
  if (type === "journal")
    return isInternational
      ? "bg-blue-50 text-blue-700 border border-blue-200"
      : "bg-sky-50 text-sky-700 border border-sky-200";
  if (type === "conference")
    return isInternational
      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
      : "bg-violet-50 text-violet-700 border border-violet-200";
  const styles: Record<string, string> = {
    patent: "bg-amber-50 text-amber-700 border border-amber-200",
    thesis: "bg-rose-50 text-rose-700 border border-rose-200",
    report: "bg-slate-100 text-slate-700 border border-slate-200",
  };
  return styles[type] ?? "bg-slate-100 text-slate-700 border border-slate-200";
}

type PublicationCardProps = {
  publication: Publication;
  members?: Pick<Member, "nameKo" | "nameEn" | "slug">[];
};

export function PublicationCard({
  publication,
  members = [],
}: PublicationCardProps) {
  const {
    slug,
    title,
    authors,
    type,
    isInternational,
    venue,
    year,
    month,
    keywords,
    isFeatured,
  } = publication;

  const typeLabel = getTypeLabel(type, isInternational);
  const typeStyle = getTypeStyle(type, isInternational);
  const venueDate =
    month != null ? `${venue}, ${year}.${month}` : `${venue}, ${year}`;

  return (
    <article className="rounded-xl border border-border bg-white p-6 card-hover group flex flex-col h-full">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${typeStyle}`}
          >
            {typeLabel}
          </span>
          {isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Featured
            </span>
          )}
        </div>
        <span className="text-sm text-text-secondary font-semibold font-mono bg-surface px-2 py-0.5 rounded">
          {year}
        </span>
      </div>

      <h3 className="text-[1.05rem] font-bold text-foreground leading-snug mb-3 pr-4 group-hover:text-primary transition-colors">
        <Link
          href={`/publications/${slug}`}
          className="before:absolute before:inset-0"
        >
          {title}
        </Link>
      </h3>

      <div className="mt-auto pt-2">
        <p className="text-[13px] text-text-secondary font-medium leading-relaxed mb-1.5 flex items-center gap-2">
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
            className="opacity-70"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="truncate">
            {authors.map((author, idx) => {
              const matched = members.find(
                (m) => m.nameKo === author || m.nameEn === author,
              );
              return (
                <span key={idx}>
                  {idx > 0 && ", "}
                  {matched ? (
                    <Link
                      href={`/members/${matched.slug}`}
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

        <p className="text-[13px] text-text-secondary font-medium mb-5 flex items-center gap-2">
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
            className="opacity-70"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          {venueDate}
        </p>

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
