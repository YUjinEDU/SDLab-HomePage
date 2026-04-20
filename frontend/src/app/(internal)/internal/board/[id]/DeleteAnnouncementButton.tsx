"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAnnouncement } from "@/actions/announcements";

export default function DeleteAnnouncementButton({ id }: { id: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    const result = await deleteAnnouncement(id);
    if (result.error) {
      alert(result.error);
    } else {
      router.push("/internal/board");
    }
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button
          onClick={handleDelete}
          className="text-sm font-medium text-red-600 hover:text-red-800"
        >
          확인
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          취소
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-red-600 hover:text-red-800 font-medium"
    >
      삭제
    </button>
  );
}
