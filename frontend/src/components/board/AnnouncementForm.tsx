"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { AnnouncementRow } from "@/lib/queries/announcements";

type Props = {
  announcement?: AnnouncementRow;
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  title: string;
  backHref: string;
};

export function AnnouncementForm({ announcement, action, title, backHref }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setError(null);
      const result = await action(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push(backHref);
      }
    });
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="rounded-xl border border-border bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-text-secondary px-2">공지 내용</legend>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={announcement?.title ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-text-secondary mb-1">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              rows={12}
              required
              defaultValue={announcement?.content ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isPinned"
              name="isPinned"
              type="checkbox"
              defaultChecked={announcement?.isPinned ?? false}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="isPinned" className="text-sm font-medium text-text-secondary">
              상단 고정
            </label>
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
