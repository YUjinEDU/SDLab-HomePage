"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const otherLocale = locale === "ko" ? "en" : "ko";

  function handleToggle() {
    startTransition(() => {
      router.replace(pathname, { locale: otherLocale });
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-md border border-border text-text-secondary hover:text-primary hover:border-primary/50 transition-colors disabled:opacity-50"
      aria-label={locale === "ko" ? "Switch to English" : "한국어로 전환"}
    >
      <span
        className={locale === "ko" ? "text-primary" : "text-text-secondary/60"}
      >
        KO
      </span>
      <span className="text-border">|</span>
      <span
        className={locale === "en" ? "text-primary" : "text-text-secondary/60"}
      >
        EN
      </span>
    </button>
  );
}
