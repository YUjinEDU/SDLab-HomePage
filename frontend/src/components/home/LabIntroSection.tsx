import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { getAlumniCount } from "@/lib/queries";

export async function LabIntroSection() {
  const t = await getTranslations("labIntro");
  const alumniCount = await getAlumniCount();

  const stats = [
    { value: "1996", label: t("statFounded") },
    { value: `${alumniCount}+`, label: t("statAlumni") },
    { value: "14", label: t("statTechTransfer") },
  ];

  return (
    <section className="py-24 lg:py-32 relative">
      <Container>
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            {t("sectionLabel")}
          </p>
          <h2 className="font-display text-3xl sm:text-[2.5rem] font-extrabold text-foreground mb-8 leading-tight">
            {t("heading")}{" "}
            <span className="text-gradient">{t("headingHighlight")}</span>
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-[1.85] max-w-3xl">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white rounded-xl p-6 border border-border"
            >
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-text-secondary mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
