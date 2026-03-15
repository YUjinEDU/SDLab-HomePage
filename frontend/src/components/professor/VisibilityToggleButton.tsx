"use client";

import { useState, useTransition } from "react";

type ToggleFn = (
  id: string,
  isPublic: boolean,
) => Promise<{ error?: string } | { success: boolean }>;

type Props = {
  id: string;
  initialIsPublic: boolean;
  toggle: ToggleFn;
};

export default function VisibilityToggleButton({
  id,
  initialIsPublic,
  toggle,
}: Props) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const next = !isPublic;
    setIsPublic(next); // optimistic update

    startTransition(async () => {
      const result = await toggle(id, next);
      if ("error" in result && result.error) {
        console.error("공개 설정 변경 실패:", result.error);
        setIsPublic(!next); // revert on error
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium transition-colors ${
        isPending
          ? "cursor-not-allowed opacity-50"
          : isPublic
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
    >
      {isPublic ? "공개" : "비공개"}
    </button>
  );
}
