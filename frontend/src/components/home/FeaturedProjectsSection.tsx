import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";

export async function FeaturedProjectsSection() {
  const t = await getTranslations("featured");

  return (
    <section className="py-24 lg:py-32">
      <Container>
        <div className="max-w-4xl mx-auto mb-14">
          <p className="font-display text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            {t("projectsLabel")}
          </p>
          <h2 className="font-display text-3xl sm:text-[2.5rem] font-extrabold text-foreground mb-4 leading-tight">
            {t("projectsHeading")}{" "}
            <span className="text-gradient">
              {t("projectsHeadingHighlight")}
            </span>
          </h2>
          <p className="text-base text-text-secondary max-w-2xl leading-relaxed">
            대형 연구사업 총괄 수행 및 다수의 특허, 논문, 기술이전 실적을
            보유하고 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="card-hover rounded-2xl border border-border bg-white p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-2 h-8 bg-primary rounded-full" />
              <h3 className="text-lg font-extrabold text-foreground">
                AI융합연구센터지원사업
              </h3>
            </div>
            <dl className="space-y-5">
              <div className="flex justify-between items-baseline">
                <dt className="text-sm text-text-secondary">특허등록/출원</dt>
                <dd className="font-display text-2xl font-extrabold text-primary">
                  23건
                </dd>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-baseline">
                <dt className="text-sm text-text-secondary">SCI(E) 논문</dt>
                <dd className="font-display text-2xl font-extrabold text-primary">
                  37건
                </dd>
              </div>
            </dl>
          </div>

          <div className="card-hover rounded-2xl border border-border bg-white p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-2 h-8 bg-accent rounded-full" />
              <h3 className="text-lg font-extrabold text-foreground">
                AI융합혁신인재양성사업
              </h3>
            </div>
            <dl className="space-y-5">
              <div className="flex justify-between items-baseline">
                <dt className="text-sm text-text-secondary">특허등록/출원</dt>
                <dd className="font-display text-2xl font-extrabold text-primary">
                  17건
                </dd>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-baseline">
                <dt className="text-sm text-text-secondary">SCI(E) 논문</dt>
                <dd className="font-display text-2xl font-extrabold text-primary">
                  31건
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
