"use client";

import { useState } from "react";
import { members } from "@/data/members";
import type { MemberGroup } from "@/types";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/shared/PageHero";
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

export default function StudentsPage() {
  const [activeGroup, setActiveGroup] = useState<string>("all");

  const students = members.filter((m) => m.group !== "professor");

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
        title="연구원"
        description="스마트데이터연구실의 연구원을 소개합니다"
        breadcrumb="연구원"
      />

      <Container className="py-14">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            연구원 목록
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
      </Container>
    </>
  );
}
