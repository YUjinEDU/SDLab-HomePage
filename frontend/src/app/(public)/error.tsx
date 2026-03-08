"use client";

import { Container } from "@/components/layout/Container";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-32 text-center">
      <h2 className="font-display text-2xl font-extrabold text-foreground mb-4">
        문제가 발생했습니다
      </h2>
      <p className="text-sm text-text-secondary mb-8">
        데이터를 불러오지 못했습니다. 잠시 후 다시 시도하세요.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors"
      >
        다시 시도
      </button>
    </Container>
  );
}
