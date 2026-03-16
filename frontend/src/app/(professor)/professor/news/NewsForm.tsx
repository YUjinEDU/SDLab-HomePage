"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNews, updateNews } from "@/actions/news";
import type { NewsItem, BoardCategory } from "@/types";
import type { Project } from "@/types";
import type { Publication } from "@/types";

type NewsFormProps = {
  newsItem?: NewsItem | null;
  projects: Project[];
  publications: Publication[];
};

const CATEGORY_OPTIONS: { value: BoardCategory; label: string }[] = [
  { value: "notice", label: "공지" },
  { value: "award", label: "수상" },
  { value: "event", label: "행사" },
  { value: "acceptance", label: "논문 게재" },
  { value: "recruitment", label: "모집" },
];

export default function NewsForm({
  newsItem,
  projects,
  publications,
}: NewsFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!newsItem;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = isEdit
      ? await updateNews(newsItem!.id, formData)
      : await createNews(formData);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      router.push("/professor/news");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 기본 정보 */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">기본 정보</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              제목 *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={newsItem?.title ?? ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-gray-700"
            >
              요약 *
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={3}
              required
              defaultValue={newsItem?.summary ?? ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                카테고리 *
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue={newsItem?.category ?? "notice"}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                날짜 *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={
                  newsItem?.date ?? new Date().toISOString().slice(0, 10)
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isPinned"
              name="isPinned"
              type="checkbox"
              defaultChecked={newsItem?.isPinned ?? false}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label
              htmlFor="isPinned"
              className="text-sm font-medium text-gray-700"
            >
              상단 고정
            </label>
          </div>
        </div>
      </section>

      {/* 관계 설정 */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">관계 설정</h2>
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              관련 프로젝트
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {projects.map((proj) => (
                <label
                  key={proj.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    name="projectIds"
                    value={proj.id}
                    defaultChecked={newsItem?.relatedProjectIds.includes(
                      proj.id,
                    )}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  {proj.title}
                </label>
              ))}
            </div>
            {projects.length === 0 && (
              <p className="text-sm text-gray-500">
                등록된 프로젝트가 없습니다.
              </p>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">관련 논문</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {publications.map((pub) => (
                <label key={pub.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="publicationIds"
                    value={pub.id}
                    defaultChecked={newsItem?.relatedPublicationIds.includes(
                      pub.id,
                    )}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="truncate">
                    {pub.title} ({pub.year})
                  </span>
                </label>
              ))}
            </div>
            {publications.length === 0 && (
              <p className="text-sm text-gray-500">등록된 논문이 없습니다.</p>
            )}
          </div>
        </div>
      </section>

      {/* 버튼 */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => router.push("/professor/news")}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
        >
          {submitting ? "저장 중..." : isEdit ? "수정" : "등록"}
        </button>
      </div>
    </form>
  );
}
