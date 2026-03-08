import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function ContactSummarySection() {
  return (
    <section className="py-20 bg-dark-bg text-white">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-display text-2xl font-extrabold mb-3">
              Contact Us
            </h2>
            <p className="text-sm text-white/50 leading-relaxed">
              충남대학교 공대 5호관 532호 (연구실) / 516호 (교수 연구실)
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-white/50">
              <a
                href="mailto:ykim@cnu.ac.kr"
                className="text-primary-light hover:text-white transition-colors"
              >
                ykim@cnu.ac.kr
              </a>
              <span>042-821-7441 (연구실)</span>
              <span>042-821-5450 (교수 연구실)</span>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex-shrink-0"
          >
            오시는 길
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
