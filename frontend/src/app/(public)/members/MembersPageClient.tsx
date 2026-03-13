"use client";

import { useState } from "react";
import Link from "next/link";
import type { Member, MemberGroup } from "@/types";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/shared/PageHero";
import { MemberGroupTabs } from "@/components/members/MemberGroupTabs";
import { MemberGrid } from "@/components/members/MemberGrid";
import { MemberContactLinks } from "@/components/members/MemberContactLinks";
import { groupLabelsShort } from "@/data/stats";
import { TagBadge } from "@/components/shared/TagBadge";

const TAB_ORDER: (MemberGroup | "all")[] = [
  "all",
  "phd",
  "ms",
  "undergraduate",
  "alumni",
];

type Props = {
  professor: Member | null;
  students: Member[];
};

export function MembersPageClient({ professor, students }: Props) {
  const [activeGroup, setActiveGroup] = useState<string>("all");

  const presentGroups = TAB_ORDER.filter((g) => {
    if (g === "all") return true;
    return students.some((m) => m.group === g);
  });

  const tabs = presentGroups.map((g) => ({
    value: g,
    label: g === "all" ? "전체" : (groupLabelsShort[g] ?? g),
    count:
      g === "all"
        ? students.length
        : students.filter((m) => m.group === g).length,
  }));

  const filteredStudents =
    activeGroup === "all"
      ? students
      : students.filter((m) => m.group === activeGroup);

  const initials = professor
    ? professor.nameKo
        .split("")
        .filter((_, i) => i === 0 || i === professor.nameKo.length - 1)
        .join("")
        .slice(0, 2)
    : "";

  return (
    <>
      <PageHero
        title="구성원"
        description="스마트데이터연구실의 지도교수 및 연구원을 소개합니다"
        breadcrumb="구성원"
      />

      <Container className="py-14">
        {/* 교수님 섹션 */}
        {professor && (
          <section className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-6">
              지도교수
            </h2>
            <article className="relative max-w-2xl rounded-2xl border border-border bg-white p-6 card-hover group">
              <div className="flex items-start gap-5">
                {professor.image ? (
                  <img
                    src={professor.image}
                    alt={professor.nameKo}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm border border-border"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-muted to-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-black text-primary">
                      {initials}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                    <Link
                      href={`/members/${professor.slug}`}
                      className="before:absolute before:inset-0"
                    >
                      {professor.nameKo}
                    </Link>
                  </h3>
                  <p className="text-sm font-medium text-text-secondary font-mono mb-1">
                    {professor.nameEn}
                  </p>
                  <p className="text-sm text-text-secondary mb-3">
                    {professor.position} · {professor.department}
                  </p>
                  {professor.researchKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {professor.researchKeywords.slice(0, 4).map((kw) => (
                        <TagBadge key={kw} label={kw} variant="primary" />
                      ))}
                    </div>
                  )}
                  {(professor.email ||
                    Object.values(professor.links).some(Boolean)) && (
                    <div className="relative z-10">
                      <MemberContactLinks
                        email={professor.email}
                        links={professor.links}
                      />
                    </div>
                  )}
                </div>
              </div>
            </article>
          </section>
        )}

        {/* 연구원 섹션 */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              연구원
            </h2>
            {tabs.length > 1 && (
              <MemberGroupTabs
                groups={tabs}
                activeGroup={activeGroup}
                onChange={setActiveGroup}
              />
            )}
          </div>

          {activeGroup === "all" ? (
            TAB_ORDER.filter((g) => g !== "all").map((group) => {
              const groupMembers = students.filter((m) => m.group === group);
              if (groupMembers.length === 0) return null;
              return (
                <div key={group} className="mb-10">
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                    {groupLabelsShort[group] ?? group} ({groupMembers.length})
                  </h3>
                  <MemberGrid members={groupMembers} />
                </div>
              );
            })
          ) : (
            <MemberGrid members={filteredStudents} />
          )}
        </section>
      </Container>
    </>
  );
}
