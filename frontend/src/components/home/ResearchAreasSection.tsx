import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";

const areaKeys = [
  {
    titleKey: "area1Title" as const,
    descKey: "area1Description" as const,
    keywordsKey: "area1Keywords" as const,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
      </svg>
    ),
  },
  {
    titleKey: "area2Title" as const,
    descKey: "area2Description" as const,
    keywordsKey: "area2Keywords" as const,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 20h10" />
        <path d="M10 20c5.5-2.5.8-6.4 3-10" />
        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
        <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
      </svg>
    ),
  },
  {
    titleKey: "area3Title" as const,
    descKey: "area3Description" as const,
    keywordsKey: "area3Keywords" as const,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
      </svg>
    ),
  },
];

export async function ResearchAreasSection() {
  const t = await getTranslations("research");

  return (
    <section className="py-24 lg:py-32 bg-surface relative overflow-hidden">
      {/* Decorative dot pattern */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] dot-pattern opacity-50" />

      <Container className="relative">
        <div className="max-w-4xl mx-auto mb-14">
          <p className="font-display text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            {t("sectionLabel")}
          </p>
          <h2 className="font-display text-3xl sm:text-[2.5rem] font-extrabold text-foreground leading-tight">
            {t("heading")}{" "}
            <span className="text-gradient">{t("headingHighlight")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {areaKeys.map((area) => {
            const title = t(area.titleKey);
            const description = t(area.descKey);
            const keywords = t(area.keywordsKey).split(",");

            return (
              <div
                key={area.titleKey}
                className="card-hover bg-white rounded-2xl p-8 lg:p-10 border border-border shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-muted text-primary flex items-center justify-center mb-7">
                  {area.icon}
                </div>
                <h3 className="text-lg font-extrabold text-foreground mb-3 leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs font-semibold text-primary bg-primary-muted px-3 py-1 rounded-full"
                    >
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/research"
            className="inline-flex items-center gap-2.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
          >
            {t("viewAll")}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
