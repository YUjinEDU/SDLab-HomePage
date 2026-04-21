import { getTranslations } from "next-intl/server";

type Props = {
  address: string;
  embedUrl: string | null;
};

export async function MapSection({ address, embedUrl }: Props) {
  const t = await getTranslations("contact");

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={t("mapAlt")}
          width="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block border-0 h-64 sm:h-80 md:h-[400px]"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-6 px-6 text-center bg-primary-muted/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-secondary"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {t("infoHeading")}
            </p>
            <p className="mt-1 text-text-secondary text-sm">{address}</p>
          </div>
        </div>
      )}
    </div>
  );
}
