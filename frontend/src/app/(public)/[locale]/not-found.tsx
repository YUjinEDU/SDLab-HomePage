import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";

export default async function NotFound() {
  const t = await getTranslations("error");

  return (
    <Container className="py-32">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-foreground mb-2">{t("notFoundTitle")}</p>
        <p className="text-text-secondary mb-8">{t("notFoundDescription")}</p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {t("goHome")}
        </Link>
      </div>
    </Container>
  );
}
