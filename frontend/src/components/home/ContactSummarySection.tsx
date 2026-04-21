import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import type { ContactInfo } from "@/types";

type ContactSummarySectionProps = {
  contactInfo: ContactInfo;
};

export async function ContactSummarySection({
  contactInfo,
}: ContactSummarySectionProps) {
  const t = await getTranslations("contact");

  return (
    <section className="py-10 bg-dark-bg text-white">
      <Container>
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-xl font-extrabold">
            {t("snapshotHeading")}{" "}
            <span className="text-gradient">
              {t("snapshotHeadingHighlight")}
            </span>
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/50">
            <a
              href={`mailto:${contactInfo.professor.email}`}
              className="text-primary-light hover:text-white transition-colors"
            >
              {contactInfo.professor.email}
            </a>
            <span>{contactInfo.location.labPhone} (연구실)</span>
            <span>{contactInfo.location.professorPhone} (교수 연구실)</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
