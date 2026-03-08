import Link from "next/link";
import type { Member, MemberGroup } from "@/types";
import { TagBadge } from "@/components/shared/TagBadge";
import { MemberContactLinks } from "./MemberContactLinks";
import { groupLabels } from "@/data/stats";

type Props = {
  member: Member;
};

function InitialsAvatar({ name, group }: { name: string; group: MemberGroup }) {
  const initials = name
    .split("")
    .filter((_, i) => i === 0 || i === name.length - 1)
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isAlumni = group === "alumni";

  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${isAlumni ? "bg-slate-50 border-slate-200 text-slate-400" : "bg-gradient-to-br from-primary-muted to-blue-50/50 border-primary/20 text-primary"}`}
    >
      <span className="text-xl sm:text-2xl font-black">{initials}</span>
    </div>
  );
}

export function MemberCard({ member }: Props) {
  return (
    <article className="rounded-2xl border border-border bg-white p-6 flex flex-col gap-5 card-hover group h-full">
      {/* Header: avatar + name/position */}
      <div className="flex items-start gap-4 sm:gap-5">
        {member.image ? (
          <img
            src={member.image}
            alt={member.nameKo}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 shadow-sm border border-border"
          />
        ) : (
          <InitialsAvatar name={member.nameKo} group={member.group} />
        )}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide uppercase ${member.group === "alumni" ? "bg-slate-100 text-slate-500" : "bg-primary/10 text-primary"}`}
            >
              {groupLabels[member.group]}
            </span>
          </div>
          <h3 className="text-[1.15rem] font-bold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
            <Link href={`/members/${member.slug}`}>{member.nameKo}</Link>
          </h3>
          <p className="text-[13px] font-medium text-text-secondary/80 font-mono tracking-tight">
            {member.nameEn}
          </p>
          <p className="text-[13px] text-text-secondary mt-1.5 font-medium">
            {member.position}
          </p>
        </div>
      </div>

      {/* Research Keywords */}
      <div className="flex-1">
        {member.researchKeywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {member.researchKeywords.map((kw) => (
              <TagBadge key={kw} label={kw} variant="muted" />
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      {(member.email || Object.values(member.links).some(Boolean)) && (
        <div className="pt-4 border-t border-border/60 mt-auto">
          <MemberContactLinks email={member.email} links={member.links} />
        </div>
      )}
    </article>
  );
}
