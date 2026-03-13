import type { Publication, Member } from "@/types";
import { PublicationCard } from "./PublicationCard";
import { EmptyState } from "@/components/shared/EmptyState";

type PublicationListProps = {
  publications: Publication[];
  members?: Pick<Member, "nameKo" | "nameEn" | "slug">[];
  emptyMessage?: string;
};

export function PublicationList({
  publications,
  members = [],
  emptyMessage = "조건에 맞는 논문이 없습니다.",
}: PublicationListProps) {
  if (publications.length === 0) {
    return (
      <EmptyState title="논문을 찾을 수 없습니다" description={emptyMessage} />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {publications.map((pub) => (
        <PublicationCard key={pub.id} publication={pub} members={members} />
      ))}
    </div>
  );
}
