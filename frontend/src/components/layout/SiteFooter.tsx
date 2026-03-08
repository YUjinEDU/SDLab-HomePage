import Link from "next/link";
import { Container } from "./Container";

const quickLinks = [
  { href: "/members", label: "Members" },
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-dark-bg text-white">
      <Container className="py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Lab info */}
          <div>
            <h3 className="font-display text-sm font-extrabold mb-4 tracking-wide text-white">
              Smart Data Lab
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              충남대학교 컴퓨터융합학부
              <br />
              스마트데이터연구실
            </p>
            <p className="mt-3 text-sm text-white/50 leading-relaxed">
              대전광역시 유성구 대학로 99
              <br />
              충남대학교 공대 5호관 532호
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-sm font-extrabold mb-4 tracking-wide text-white">
              바로가기
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
              연락처
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
              <li>042-821-7441 (연구실)</li>
              <li>042-821-5450 (교수 연구실)</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/30">
          &copy; 2026 Smart Data Lab, 충남대학교 컴퓨터융합학부
        </div>
      </Container>
    </footer>
  );
}
