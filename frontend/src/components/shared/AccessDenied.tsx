"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/layout/Container";

type AccessDeniedProps = {
  title?: string;
  description?: string;
};

export function AccessDenied({
  title = "접근 권한이 없습니다",
  description = "이 페이지는 연구실 구성원만 열람할 수 있습니다. 로그인 후 이용해 주세요.",
}: AccessDeniedProps) {
  const t = useTranslations("accessDenied");

  return (
    <>
      <PageHero title={title} breadcrumb="Access Denied" />

      <section className="py-16">
        <Container>
          <div className="text-center max-w-md mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto text-text-secondary/40 mb-6"
              aria-hidden="true"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-text-secondary leading-relaxed mb-8">
              {description}
            </p>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {t("login")}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
