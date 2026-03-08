import Link from "next/link";
import { getProfessor } from "@/lib/queries";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/shared/PageHero";
import { ProfessorProfile } from "@/components/members/ProfessorProfile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "지도교수 | 스마트데이터연구실",
  description: "스마트데이터연구실 지도교수 소개",
};

export default async function MembersPage() {
  const professor = await getProfessor();

  return (
    <>
      <PageHero
        title="지도교수"
        description="스마트데이터연구실을 이끌고 있는 지도교수를 소개합니다"
        breadcrumb="지도교수"
      />

      <Container className="py-14">
        {professor && <ProfessorProfile member={professor} />}

        {/* Link to students page */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <Link
            href="/members/students"
            className="inline-flex items-center gap-2.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
          >
            연구원 전체 보기
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
    </>
  );
}
