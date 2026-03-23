"use client";

import { useTranslations } from "next-intl";

type PaginationProps = {
  total: number;
  page: number;
  perPage: number;
  onChange: (page: number) => void;
};

export function Pagination({
  total,
  page,
  perPage,
  onChange,
}: PaginationProps) {
  const t = useTranslations("common");
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisible =
      typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label={t("pageNav")}
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-primary-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {t("prev")}
      </button>

      {getPageNumbers().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-text-secondary">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-9 h-9 sm:w-10 sm:h-10 text-sm font-medium rounded-lg transition-colors ${
              p === page
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-primary-muted"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-primary-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {t("next")}
      </button>
    </nav>
  );
}
