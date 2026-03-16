import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
    <section className="py-20 bg-dark-bg text-white">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-display text-2xl font-extrabold mb-3">
              {t("snapshotHeading")}{" "}
              <span className="text-gradient">
                {t("snapshotHeadingHighlight")}
              </span>
            </h2>
            <p className="text-sm text-white/50 leading-relaxed">
              {contactInfo.location.building} {contactInfo.location.lab}{" "}
              (연구실) / {contactInfo.location.professorOffice} (교수 연구실)
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-white/50">
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
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex-shrink-0"
          >
            {t("viewContact")}
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
