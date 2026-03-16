import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";

export async function SiteFooter() {
  const t = await getTranslations();

  const quickLinks = [
    { href: "/members", label: t("nav.members") },
    { href: "/research", label: t("nav.research") },
    { href: "/publications", label: t("nav.publications") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <footer className="bg-dark-bg text-white">
      <Container className="py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Lab info */}
          <div>
            <h3 className="font-display text-sm font-extrabold mb-4 tracking-wide text-white">
              {t("footer.labName")}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              {t("footer.department")}
              <br />
              {t("footer.labFullName")}
            </p>
            <p className="mt-3 text-sm text-white/50 leading-relaxed">
              {t("footer.address")}
              <br />
              {t("footer.room")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-sm font-extrabold mb-4 tracking-wide text-white">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-primary-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-extrabold mb-4 tracking-wide text-white">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <a
                  href="mailto:ykim@cnu.ac.kr"
                  className="hover:text-primary-light transition-colors"
                >
                  ykim@cnu.ac.kr
                </a>
              </li>
              <li>{t("footer.phone_lab")}</li>
              <li>{t("footer.phone_prof")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/30">
          {t("footer.copyright")}
        </div>
      </Container>
    </footer>
  );
}
