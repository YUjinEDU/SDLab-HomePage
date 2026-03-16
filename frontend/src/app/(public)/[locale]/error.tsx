"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <Container className="py-32 text-center">
      <h2 className="font-display text-2xl font-extrabold text-foreground mb-4">
        {t("errorTitle")}
      </h2>
      <p className="text-sm text-text-secondary mb-8">
        {t("errorDescription")}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors"
      >
        {t("retry")}
      </button>
    </Container>
  );
}
