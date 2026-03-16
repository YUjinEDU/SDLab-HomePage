import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import type { Member } from "@/types";

type MembersSnapshotSectionProps = {
  members: Member[];
};

export async function MembersSnapshotSection({
  members,
}: MembersSnapshotSectionProps) {
  const t = await getTranslations("members");

  const professor = members.find((m) => m.group === "professor");
  const others = members.filter((m) => m.group !== "professor");

  const groupLabelMap: Record<string, string> = {
    professor: t("groupProfessor"),
    phd: t("groupPhd"),
    ms: t("groupMs"),
    combined: t("groupCombined"),
    undergraduate: t("groupUndergraduate"),
    alumni: t("groupAlumni"),
  };

  const groupCounts = others.reduce<Record<string, number>>((acc, m) => {
    acc[m.group] = (acc[m.group] ?? 0) + 1;
    return acc;
  }, {});

  const summary = Object.entries(groupCounts)
    .map(([group, count]) => `${groupLabelMap[group] ?? group} ${count}`)
    .join(", ");

  return (
    <section className="py-24 lg:py-32">
      <Container>
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            {t("snapshotLabel")}
          </p>
          <h2 className="font-display text-3xl sm:text-[2.5rem] font-extrabold text-foreground mb-6 leading-tight">
            <span className="text-gradient">{t("snapshotHeading")}</span>{" "}
            {t("snapshotHeadingHighlight")}
          </h2>
          {professor && (
            <p className="text-base text-text-secondary leading-relaxed">
              {t("groupProfessor")} {professor.nameKo}{" "}
              <span className="text-foreground font-semibold">{summary}</span>
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-6">
            <Link
              href="/members"
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
        </div>
      </Container>
    </section>
  );
}
