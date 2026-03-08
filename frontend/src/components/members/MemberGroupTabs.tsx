"use client";

import type { MemberGroup } from "@/types";

type TabItem = {
  value: MemberGroup | "all";
  label: string;
  count: number;
};

type Props = {
  groups: TabItem[];
  activeGroup: string;
  onChange: (group: string) => void;
};

export function MemberGroupTabs({ groups, activeGroup, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="구성원 분류"
      className="flex flex-wrap gap-2"
    >
      {groups.map((tab) => {
        const isActive = tab.value === activeGroup;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={[
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-surface border border-border text-text-secondary hover:text-foreground hover:border-primary/50",
            ].join(" ")}
          >
            {tab.label}
            <span
              className={[
                "text-xs px-1.5 py-0.5 rounded-full font-semibold",
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary-muted text-primary",
              ].join(" ")}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
