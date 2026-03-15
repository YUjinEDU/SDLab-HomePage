import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import { getPatentBySlug, getMembers } from "@/lib/queries";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const patent = await getPatentBySlug(slug);
  if (!patent) return { title: "Patent Not Found" };
  return {
    title: `${patent.title} | SD Lab`,
    description: patent.note ?? patent.title,
  };
}

export default async function PatentDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const [patent, members, t] = await Promise.all([
    getPatentBySlug(slug),
    getMembers(),
    getTranslations({ locale, namespace: "patents" }),
  ]);

  if (!patent) notFound();

  const authorMembers = patent.inventors
    .map((name) => members.find((m) => m.nameEn === name || m.nameKo === name))
    .filter(Boolean);

  return (
    <div className="py-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-6 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <Link
            href="/patents"
            className="hover:text-primary transition-colors"
          >
            {t("pageTitle")}
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground truncate max-w-[150px] sm:max-w-[300px]">
            {patent.title}
          </span>
        </nav>

        {/* Back link */}
        <Link
          href="/patents"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          {t("backToList")}
        </Link>

        <div className="max-w-3xl">
          {/* Type badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              {t("labelPatent")}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug mb-4">
            {patent.title}
          </h1>

          {/* Inventors */}
          <p className="text-base text-text-secondary mb-2">
            {patent.inventors.map((inventor, idx) => {
              const memberMatch = authorMembers.find(
                (m) => m!.nameEn === inventor || m!.nameKo === inventor,
              );
              return (
                <span key={inventor}>
                  {idx > 0 && ", "}
                  {memberMatch ? (
                    <Link
                      href={`/members/${memberMatch.slug}`}
                      className="text-primary hover:text-primary-dark transition-colors font-medium"
                    >
                      {inventor}
                    </Link>
                  ) : (
                    inventor
                  )}
                </span>
              );
            })}
          </p>

          {/* Date and patent number */}
          {patent.date && (
            <p className="text-sm text-text-secondary italic mb-2">
              {patent.date}
            </p>
          )}
          {patent.patentNumber && (
            <p className="text-sm text-text-secondary font-mono mb-6">
              {patent.status === "등록"
                ? t("labelRegistrationNo")
                : t("labelApplicationNo")}
              : {patent.patentNumber}
            </p>
          )}

          <hr className="border-border my-8" />

          {/* Note */}
          {patent.note && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                {t("sectionAbstract")}
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary">
                {patent.note}
              </p>
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}
