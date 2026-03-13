import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { TagBadge } from "@/components/shared/TagBadge";
import { MemberContactLinks } from "@/components/members/MemberContactLinks";
import { MemberEducationTimeline } from "@/components/members/MemberEducationTimeline";
import { MemberCareerTimeline } from "@/components/members/MemberCareerTimeline";
import {
  getMemberBySlug,
  getPublicationsByMember,
  getProjectsByMember,
} from "@/lib/queries";
import { groupLabels } from "@/data/stats";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  if (!member) return { title: "구성원을 찾을 수 없습니다" };
  return {
    title: `${member.nameKo} | 스마트데이터연구실`,
    description: member.bio ?? `${member.nameKo} — ${member.position}`,
  };
}

export default async function MemberDetailPage({ params }: Props) {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);

  if (!member) notFound();

  const isProfessor = member.group === "professor";
  const [allMemberPubs, memberProjects] = isProfessor
    ? [[], []]
    : await Promise.all([
        getPublicationsByMember(member.id),
        getProjectsByMember(member.id),
      ]);

  const memberPubs = allMemberPubs.filter((p) => p.type !== "patent");
  const memberPatents = allMemberPubs.filter((p) => p.type === "patent");

  const initials = member.nameKo
    .split("")
    .filter((_, i) => i === 0 || i === member.nameKo.length - 1)
    .join("")
    .slice(0, 2);

  return (
    <div className="py-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-6 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            홈
          </Link>
          <span className="opacity-40">/</span>
          <Link
            href="/members"
            className="hover:text-primary transition-colors"
          >
            구성원
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground">{member.nameKo}</span>
        </nav>

        <Link
          href="/members"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          구성원 목록으로
        </Link>

        {/* ── 공통 사이드바 레이아웃 ── */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 lg:items-start">
          {/* ── 좌측 사이드바 (스티키) ── */}
          <aside className="lg:sticky lg:top-24 mb-10 lg:mb-0">
            {/* 사진 */}
            <div className="mb-5">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.nameKo}
                  className="w-56 h-56 rounded-2xl object-cover shadow-sm border border-border"
                />
              ) : (
                <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-primary-muted to-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-6xl font-black text-primary">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            {/* 이름 / 직위 */}
            <span className="text-xs font-bold text-primary bg-primary-muted px-2.5 py-0.5 rounded-full uppercase">
              {groupLabels[member.group] ?? member.group}
            </span>
            <h1 className="text-2xl font-bold text-foreground mt-2 mb-0.5">
              {member.nameKo}
            </h1>
            <p className="text-sm text-text-secondary font-mono">
              {member.nameEn}
            </p>
            <p className="text-sm text-text-secondary mt-1 mb-4">
              {member.position} · {member.department}
            </p>

            {/* 연락처 */}
            {(member.email || Object.values(member.links).some(Boolean)) && (
              <div className="mb-5">
                <MemberContactLinks email={member.email} links={member.links} />
              </div>
            )}

            {/* 연구 키워드 */}
            {member.researchKeywords.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  연구 키워드
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {member.researchKeywords.map((kw) => (
                    <TagBadge key={kw} label={kw} variant="primary" />
                  ))}
                </div>
              </div>
            )}

            {/* 학력 */}
            {member.education.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                  학력
                </p>
                <MemberEducationTimeline education={member.education} />
              </div>
            )}
          </aside>

          {/* ── 우측 메인 콘텐츠 ── */}
          <div className="min-w-0">
            {/* Bio */}
            {member.bio && (
              <section className="mb-8 pb-8 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  소개
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {member.bio}
                </p>
              </section>
            )}

            {isProfessor ? (
              /* ── 교수님: 경력 / 수상 / 학술활동 ── */
              (() => {
                const careerGroups = {
                  career: member.career.filter(
                    (c) => !c.category || c.category === "career",
                  ),
                  award: member.career.filter((c) => c.category === "award"),
                  academic_service: member.career.filter(
                    (c) => c.category === "academic_service",
                  ),
                };
                const renderCareerList = (
                  entries: typeof member.career,
                  title: string,
                  last = false,
                ) =>
                  entries.length > 0 ? (
                    <section
                      className={`mb-8${last ? "" : " pb-8 border-b border-border"}`}
                    >
                      <h2 className="text-lg font-semibold text-foreground mb-4">
                        {title}
                      </h2>
                      <ul className="flex flex-col gap-3">
                        {entries.map((entry, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-4 py-3 border-b border-border last:border-0"
                          >
                            <span className="text-xs font-mono text-text-secondary bg-surface px-2 py-1 rounded shrink-0 mt-0.5">
                              {entry.period}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {entry.role}
                              </p>
                              <p className="text-xs text-text-secondary mt-0.5">
                                {entry.organization}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null;
                return (
                  <>
                    {careerGroups.career.length > 0 && (
                      <section className="mb-8 pb-8 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground mb-4">
                          경력
                        </h2>
                        <MemberCareerTimeline career={careerGroups.career} />
                      </section>
                    )}
                    {renderCareerList(careerGroups.award, "수상 경력")}
                    {renderCareerList(
                      careerGroups.academic_service,
                      "학술 활동",
                      true,
                    )}
                  </>
                );
              })()
            ) : (
              /* ── 일반 멤버: 경력 + 논문/프로젝트/특허 ── */
              <>
                {member.career.length > 0 && (
                  <section className="mb-8 pb-8 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      경력
                    </h2>
                    <MemberCareerTimeline career={member.career} />
                  </section>
                )}

                {memberPubs.length > 0 && (
                  <section className="mb-8 pb-8 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      논문 ({memberPubs.length})
                    </h2>
                    <ul className="flex flex-col gap-3">
                      {memberPubs.map((pub) => (
                        <li key={pub.id}>
                          <Link
                            href={`/publications/${pub.slug}`}
                            className="block rounded-lg border border-border bg-surface p-4 hover:border-primary/40 hover:bg-primary-muted/20 transition-colors"
                          >
                            <p className="text-sm font-medium text-foreground leading-snug">
                              {pub.title}
                            </p>
                            <p className="text-xs text-text-secondary mt-1.5">
                              {pub.venue} · {pub.year}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {memberProjects.length > 0 && (
                  <section className="mb-8 pb-8 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      프로젝트 ({memberProjects.length})
                    </h2>
                    <ul className="flex flex-col gap-3">
                      {memberProjects.map((proj) => (
                        <li key={proj.id}>
                          <Link
                            href={`/projects/${proj.slug}`}
                            className="block rounded-lg border border-border bg-surface p-4 hover:border-primary/40 hover:bg-primary-muted/20 transition-colors"
                          >
                            <p className="text-sm font-medium text-foreground leading-snug">
                              {proj.title}
                            </p>
                            <p className="text-xs text-text-secondary mt-1.5">
                              {proj.shortDescription}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {memberPatents.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      특허 ({memberPatents.length})
                    </h2>
                    <ul className="flex flex-col gap-3">
                      {memberPatents.map((patent) => (
                        <li key={patent.id}>
                          <Link
                            href={`/patents/${patent.slug}`}
                            className="block rounded-lg border border-border bg-surface p-4 hover:border-primary/40 hover:bg-primary-muted/20 transition-colors"
                          >
                            <p className="text-sm font-medium text-foreground leading-snug">
                              {patent.title}
                            </p>
                            <p className="text-xs text-text-secondary mt-1.5">
                              {patent.venue} · {patent.year}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
