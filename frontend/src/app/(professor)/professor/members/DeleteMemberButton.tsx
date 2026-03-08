"use client";

import { useTransition } from "react";
import { deleteMember } from "@/actions/members";
import { useRouter } from "next/navigation";

type Props = {
  memberId: string;
  memberName: string;
};

export function DeleteMemberButton({ memberId, memberName }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm(`정말 "${memberName}" 멤버를 삭제하시겠습니까?`)) return;

    startTransition(async () => {
      const result = await deleteMember(memberId);
      if (result.error) {
        alert(`삭제 실패: ${result.error}`);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
    >
      {isPending ? "삭제 중..." : "삭제"}
    </button>
  );
}
