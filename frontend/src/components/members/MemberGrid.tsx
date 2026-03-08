import type { Member } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { MemberCard } from "./MemberCard";

type Props = {
  members: Member[];
};

export function MemberGrid({ members }: Props) {
  if (members.length === 0) {
    return (
      <EmptyState
        title="구성원이 없습니다"
        description="해당 분류에 등록된 구성원이 없습니다."
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <li key={member.id}>
          <MemberCard member={member} />
        </li>
      ))}
    </ul>
  );
}
