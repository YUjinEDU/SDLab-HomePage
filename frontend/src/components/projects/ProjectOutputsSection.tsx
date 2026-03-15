import { Link } from "@/i18n/navigation";
import type { Publication } from "@/types";

type Props = {
  outputs: Publication[];
  t: (key: string) => string;
};

export function ProjectOutputsSection({ outputs, t }: Props) {
  if (outputs.length === 0) return null;

  const patents = outputs.filter((o) => o.type === "patent");
  const publications = outputs.filter((o) => o.type !== "patent");

  return (
    <div className="min-w-0 w-full">
      {publications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("sectionRelatedPublications")}
          </h2>
          <ul className="flex flex-col gap-3">
            {publications.map((pub) => (
              <li key={pub.id} className="min-w-0">
                <Link
                  href={`/publications/${pub.slug}`}
                  className="block rounded-lg border border-border bg-surface p-4 hover:border-primary/40 hover:bg-primary-muted/20 transition-colors min-w-0"
                >
                  <p className="text-sm font-medium text-foreground leading-snug min-w-0 break-words">
                    {pub.title}
                  </p>
                  <p className="text-xs text-text-secondary mt-1.5 truncate">
                    {pub.venue} &middot; {pub.year}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {patents.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("sectionRelatedPatents")}
          </h2>
          <ul className="flex flex-col gap-3">
            {patents.map((pat) => (
              <li key={pat.id} className="min-w-0">
                <Link
                  href={`/patents/${pat.slug}`}
                  className="block rounded-lg border border-border bg-surface p-4 hover:border-primary/40 hover:bg-primary-muted/20 transition-colors min-w-0"
                >
                  <p className="text-sm font-medium text-foreground leading-snug min-w-0 break-words">
                    {pat.title}
                  </p>
                  <p className="text-xs text-text-secondary mt-1.5 truncate">
                    {pat.venue} &middot; {pat.year}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
