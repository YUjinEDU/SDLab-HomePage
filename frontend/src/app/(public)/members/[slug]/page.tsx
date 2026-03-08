import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { TagBadge } from "@/components/shared/TagBadge";
import { MemberContactLinks } from "@/components/members/MemberContactLinks";
import { MemberEducationTimeline } from "@/components/members/MemberEducationTimeline";
import { MemberCareerTimeline } from "@/components/members/MemberCareerTimeline";
import { members } from "@/data/members";
import { publications } from "@/data/publications";
import { projects } from "@/data/projects";
import { groupLabels } from "@/data/stats";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return members.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = members.find((m) => m.slug === slug);
  if (!member) return { title: "구성원을 찾을 수 없습니다" };
  return {
    title: `${member.nameKo} | 스마트데이터연구실`,
    description: member.bio ?? `${member.nameKo} — ${member.position}`,
  };
}

export default async function MemberDetailPage({ params }: Props) {
  const { slug } = await params;
  const member = members.find((m) => m.slug === slug);

  if (!member) notFound();

  const memberPubs = publications.filter((p) =>
    p.authorMemberIds.includes(member.id),
  );
  const memberProjects = projects.filter((p) =>
    p.memberIds.includes(member.id),
  );

  const initials = member.nameKo
    .split("")
    .filter((_, i) => i === 0 || i === member.nameKo.length - 1)
    .join("")
    .slice(0, 2);

  const backHref =
    member.group === "professor" ? "/members" : "/members/students";
  const backLabel =
    member.group === "professor" ? "지도교수 페이지로" : "연구원 목록으로";

  return (
    <div className="py-12">
      <Container>
        <Link
          href={backHref}
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
          {backLabel}
        </Link>

        <div className="max-w-3xl">
          {/* Profile header */}
          <div className="flex items-start gap-5 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-muted to-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-2xl font-black text-primary">
                {initials}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-primary bg-primary-muted px-2.5 py-0.5 rounded-full uppercase">
                {groupLabels[member.group] ?? member.group}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
                {member.nameKo}
              </h1>
              <p className="text-sm text-text-secondary font-mono mt-1">
                {member.nameEn}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                {member.position} · {member.department}
              </p>
            </div>
          </div>

          {/* Contact links */}
          {(member.email || Object.values(member.links).some(Boolean)) && (
            <div className="mb-8">
              <MemberContactLinks email={member.email} links={member.links} />
            </div>
          )}

          {/* Bio */}
          {member.bio && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                소개
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {member.bio}
              </p>
            </section>
          )}

          {/* Research keywords */}
          {member.researchKeywords.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                연구 키워드
              </h2>
              <div className="flex flex-wrap gap-2">
                {member.researchKeywords.map((kw) => (
                  <TagBadge key={kw} label={kw} variant="primary" />
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {member.education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                학력
              </h2>
              <MemberEducationTimeline education={member.education} />
            </section>
          )}

          {/* Career */}
          {member.career.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                경력
              </h2>
              <MemberCareerTimeline career={member.career} />
            </section>
          )}

          <hr className="border-border my-8" />

          {/* Publications by this member */}
          {memberPubs.length > 0 && (
            <section className="mb-8">
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

          {/* Projects by this member */}
          {memberProjects.length > 0 && (
            <section>
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
        </div>
      </Container>
    </div>
  );
}
