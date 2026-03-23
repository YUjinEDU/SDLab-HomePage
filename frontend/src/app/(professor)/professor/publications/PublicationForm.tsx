"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPublication, updatePublication } from "@/actions/publications";
import type { Publication, PublicationType } from "@/types";
import type { Member } from "@/types";
import type { ResearchArea } from "@/types";
import type { Project } from "@/types";

type PublicationFormProps = {
  publication?: Publication | null;
  members: Member[];
  researchAreas: ResearchArea[];
  projects: Project[];
  defaultType?: PublicationType;
  defaultVenue?: string;
  redirectPath?: string;
};

// NOTE: "patent" removed — patents are now managed in a separate table (Migration 005).
// Patent management will be restored in Phase 8.
const PUBLICATION_TYPES: { value: PublicationType; label: string }[] = [
  { value: "journal", label: "저널" },
  { value: "conference", label: "학회" },
  { value: "report", label: "보고서" },
  { value: "thesis", label: "학위논문" },
];

export default function PublicationForm({
  publication,
  members,
  researchAreas,
  projects,
  defaultType,
  defaultVenue,
  redirectPath = "/professor/publications",
}: PublicationFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!publication;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = isEdit
      ? await updatePublication(publication!.id, formData)
      : await createPublication(formData);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      router.push(redirectPath);
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
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          기본 정보
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-text-secondary"
            >
              제목 *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={publication?.title ?? ""}
              className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="authors"
              className="block text-sm font-medium text-text-secondary"
            >
              저자 (쉼표로 구분) *
            </label>
            <input
              id="authors"
              name="authors"
              type="text"
              required
              defaultValue={publication?.authors.join(", ") ?? ""}
              placeholder="홍길동, John Doe, ..."
              className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-text-secondary"
              >
                유형 *
              </label>
              <select
                id="type"
                name="type"
                required
                defaultValue={publication?.type ?? defaultType ?? "journal"}
                className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {PUBLICATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-text-secondary"
              >
                연도 *
              </label>
              <input
                id="year"
                name="year"
                type="number"
                required
                defaultValue={publication?.year ?? new Date().getFullYear()}
                className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-text-secondary"
              >
                월
              </label>
              <input
                id="month"
                name="month"
                type="number"
                min={1}
                max={12}
                defaultValue={publication?.month ?? ""}
                className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="venue"
              className="block text-sm font-medium text-text-secondary"
            >
              학술지/학회명 *
            </label>
            <input
              id="venue"
              name="venue"
              type="text"
              required
              defaultValue={publication?.venue ?? defaultVenue ?? ""}
              className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {/* 상세 정보 */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          상세 정보
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="doi"
                className="block text-sm font-medium text-text-secondary"
              >
                DOI
              </label>
              <input
                id="doi"
                name="doi"
                type="text"
                defaultValue={publication?.doi ?? ""}
                className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="pdfUrl"
                className="block text-sm font-medium text-text-secondary"
              >
                PDF URL
              </label>
              <input
                id="pdfUrl"
                name="pdfUrl"
                type="url"
                defaultValue={publication?.pdfUrl ?? ""}
                className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="abstract"
              className="block text-sm font-medium text-text-secondary"
            >
              초록
            </label>
            <textarea
              id="abstract"
              name="abstract"
              rows={4}
              defaultValue={publication?.abstract ?? ""}
              className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="keywords"
              className="block text-sm font-medium text-text-secondary"
            >
              키워드 (쉼표로 구분)
            </label>
            <input
              id="keywords"
              name="keywords"
              type="text"
              defaultValue={publication?.keywords.join(", ") ?? ""}
              className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="bibtex"
              className="block text-sm font-medium text-text-secondary"
            >
              BibTeX
            </label>
            <textarea
              id="bibtex"
              name="bibtex"
              rows={4}
              defaultValue={publication?.bibtex ?? ""}
              className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm font-mono text-xs focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              defaultChecked={publication?.isFeatured ?? false}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label
              htmlFor="isFeatured"
              className="text-sm font-medium text-text-secondary"
            >
              주요 논문으로 표시
            </label>
          </div>
        </div>
      </section>

      {/* 관계 설정 */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          관계 설정
        </h2>
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-text-secondary">
              연구실 저자 (멤버)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {members.map((m) => (
                <label key={m.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="authorMemberIds"
                    value={m.id}
                    defaultChecked={publication?.authorMemberIds.includes(m.id)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  {m.nameKo} ({m.nameEn})
                </label>
              ))}
            </div>
            {members.length === 0 && (
              <p className="text-sm text-text-secondary">
                등록된 멤버가 없습니다.
              </p>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-text-secondary">
              연구 분야
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {researchAreas.map((area) => (
                <label
                  key={area.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    name="researchAreaIds"
                    value={area.id}
                    defaultChecked={publication?.researchAreaIds.includes(
                      area.id,
                    )}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  {area.title}
                </label>
              ))}
            </div>
            {researchAreas.length === 0 && (
              <p className="text-sm text-text-secondary">
                등록된 연구 분야가 없습니다.
              </p>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-text-secondary">
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
                    defaultChecked={publication?.projectIds.includes(proj.id)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  {proj.title}
                </label>
              ))}
            </div>
            {projects.length === 0 && (
              <p className="text-sm text-text-secondary">
                등록된 프로젝트가 없습니다.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 버튼 */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => router.push(redirectPath)}
          className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {submitting ? "저장 중..." : isEdit ? "수정" : "등록"}
        </button>
      </div>
    </form>
  );
}
