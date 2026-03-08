"use client";

import { useState } from "react";
import { members } from "@/data/members";
import type { MemberGroup } from "@/types";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/shared/PageHero";
import { ProfessorProfile } from "@/components/members/ProfessorProfile";
import { MemberGroupTabs } from "@/components/members/MemberGroupTabs";
import { MemberGrid } from "@/components/members/MemberGrid";
import { groupLabelsShort } from "@/data/stats";

const TAB_ORDER: (MemberGroup | "all")[] = [
  "all",
  "phd",
  "ms",
  "undergraduate",
  "alumni",
];

export default function MembersPage() {
  const [activeGroup, setActiveGroup] = useState<string>("all");

  const professor = members.find((m) => m.group === "professor") ?? null;
  const students = members.filter((m) => m.group !== "professor");

  // Build tab list from groups that have members, always including "all"
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

  return (
    <>
      <PageHero
        title="구성원"
        description="스마트데이터연구실의 구성원을 소개합니다"
      />

      <Container className="py-14">
        {/* Professor Section */}
        {professor && (
          <section aria-labelledby="professor-heading">
            <h2
              id="professor-heading"
              className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-6"
            >
              지도교수
            </h2>
            <ProfessorProfile member={professor} />
          </section>
        )}

        {/* Students Section */}
        <section aria-labelledby="students-heading">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2
              id="students-heading"
              className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
            >
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
          <MemberGrid members={filteredStudents} />
        </section>
      </Container>
    </>
  );
}
