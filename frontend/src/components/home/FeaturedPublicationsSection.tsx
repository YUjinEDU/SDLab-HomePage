import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import type { Publication, Member } from "@/types";

type FeaturedPublicationsSectionProps = {
  publications: Publication[];
  members: Member[];
};

export async function FeaturedPublicationsSection({
  publications: featured,
  members,
}: FeaturedPublicationsSectionProps) {
  const t = await getTranslations("featured");

  return (
    <section className="py-24 lg:py-32 bg-surface">
      <Container>
        <div className="max-w-5xl mx-auto mb-14">
          <p className="font-display text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            {t("publicationsLabel")}
          </p>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl sm:text-[2.5rem] font-extrabold text-foreground leading-tight">
              {t("publicationsHeading")}{" "}
              <span className="text-gradient">
                {t("publicationsHeadingHighlight")}
              </span>
            </h2>
            <Link
              href="/publications"
              className="text-sm font-bold text-primary hover:text-primary-dark transition-colors"
            >
              {t("viewAllPublications")}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {featured.map((pub) => (
            <div
              key={pub.id}
              className="card-hover block rounded-2xl border border-border bg-white p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-primary bg-primary-muted px-3 py-1 rounded-full uppercase">
                  {pub.type}
                </span>
                <span className="text-xs text-text-secondary">{pub.year}</span>
              </div>
              <h3 className="text-base font-bold text-foreground leading-snug mb-2">
                <Link
                  href={`/publications/${pub.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {pub.title}
                </Link>
              </h3>
              <p className="text-sm text-text-secondary">
                {pub.authors.map((author, i) => {
                  const memberMatch = members.find(
                    (m) => m.nameEn === author || m.nameKo === author,
                  );
                  return (
                    <span key={i}>
                      {i > 0 && ", "}
                      {memberMatch ? (
                        <Link
                          href={`/members/${memberMatch.slug}`}
                          className="text-primary hover:text-primary-dark transition-colors font-medium"
                        >
                          {author}
                        </Link>
                      ) : (
                        author
                      )}
                    </span>
                  );
                })}{" "}
                — {pub.venue}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
