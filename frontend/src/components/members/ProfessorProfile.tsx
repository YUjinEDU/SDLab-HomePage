import type { Member } from "@/types";
import { TagBadge } from "@/components/shared/TagBadge";
import { MemberEducationTimeline } from "./MemberEducationTimeline";
import { MemberCareerTimeline } from "./MemberCareerTimeline";
import { MemberContactLinks } from "./MemberContactLinks";

type Props = {
  member: Member;
};

export function ProfessorProfile({ member }: Props) {
  return (
    <article className="mb-16">
      {/* Two-column: Large photo + Basic info */}
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16 mb-16">
        {/* Professor photo — premium framing */}
        <div className="shrink-0 relative">
          {/* Decorative background accent */}
          <div className="absolute -inset-3 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl -z-10 blur-xl"></div>

          <div className="w-48 h-60 sm:w-56 sm:h-72 md:w-[280px] md:h-[360px] rounded-2xl overflow-hidden border border-border/80 shadow-2xl shadow-primary/5 bg-surface relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/professor.png"
              alt={member.nameKo}
              width={280}
              height={360}
              className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
            />
            {/* Inner gradient overlay for depth */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl"></div>
          </div>
        </div>

        {/* Info column */}
        <div className="flex-1 min-w-0 pt-2 lg:pt-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block text-[11px] font-bold tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary uppercase">
              Principal Investigator
            </span>
            <span className="w-12 h-[1px] bg-border hidden sm:block"></span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-2 tracking-tight">
            {member.nameKo}
          </h2>
          <p className="text-lg lg:text-xl text-text-secondary font-medium font-mono mb-4 tracking-tight">
            {member.nameEn}
          </p>
          <p className="text-[15px] font-medium text-text-secondary mb-8 pb-6 border-b border-border/60">
            {member.position} <span className="opacity-40 mx-2">|</span>{" "}
            {member.department}
          </p>

          {/* Bio */}
          {member.bio && (
            <div className="mb-8">
              <p className="text-[15px] leading-loose text-text-secondary/90">
                {member.bio}
              </p>
            </div>
          )}

          {/* Research Keywords */}
          {member.researchKeywords.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary/70"
                >
                  <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
                  <path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h1.66" />
                  <path d="m11 7.33-1 1.67" />
                  <path d="M14 17.67 13 16" />
                  <path d="M18 12.33 17 14" />
                  <path d="M3.46 9H8a2 2 0 0 0 2-2V2.46" />
                  <path d="M8 2.46A10 10 0 1 0 21.54 15" />
                  <path d="M3.46 15H8a2 2 0 0 0 2 2v4.54" />
                </svg>
                Core Research Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.researchKeywords.map((kw) => (
                  <TagBadge key={kw} label={kw} variant="primary" />
                ))}
              </div>
            </div>
          )}

          {/* Contact & Links */}
          <div className="bg-surface/50 rounded-xl p-5 border border-border/50">
            {member.email && (
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50">
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
                  className="text-text-secondary"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <p className="text-[14px] font-semibold text-primary">
                  {member.email}
                </p>
              </div>
            )}
            <div className="pt-1">
              <MemberContactLinks email={member.email} links={member.links} />
            </div>
          </div>
        </div>
      </div>

      {/* Education & Career — below in two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 border-t border-border pt-12">
        {member.education.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-foreground mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
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
                >
                  <path d="M21.42 10.922a2 2 0 0 1-.019 3.837l-8.5 4.304a2 2 0 0 1-1.8 0l-8.5-4.304a2 2 0 0 1-.019-3.837l8.5-4.437a2 2 0 0 1 1.838 0l8.5 4.437Z" />
                  <path d="M12 19V5" />
                  <path d="M4 12v5.197c0 1.28.847 2.41 2.08 2.632l4.8.857a2 2 0 0 0 .72 0l4.8-.857C17.633 19.61 18.48 18.48 18.48 17.197V12" />
                </svg>
              </span>
              Education
            </h3>
            <MemberEducationTimeline education={member.education} />
          </div>
        )}
        {member.career.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-foreground mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
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
                >
                  <path d="M12 12h.01" />
                  <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                  <rect width="20" height="14" x="2" y="6" rx="2" />
                </svg>
              </span>
              Career
            </h3>
            <MemberCareerTimeline career={member.career} />
          </div>
        )}
      </div>
    </article>
  );
}
