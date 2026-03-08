"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Member, MemberGroup } from "@/types";

type Props = {
  member?: Member;
  action: (
    formData: FormData,
  ) => Promise<{ error?: string; success?: boolean }>;
  title: string;
};

const GROUP_OPTIONS: { value: MemberGroup; label: string }[] = [
  { value: "professor", label: "지도교수" },
  { value: "phd", label: "박사과정" },
  { value: "ms", label: "석사과정" },
  { value: "undergraduate", label: "학부연구생" },
  { value: "alumni", label: "졸업생" },
];

export function MemberForm({ member, action, title }: Props) {
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
        router.push("/professor/members");
      }
    });
  }

  const educationDefault = member?.education?.length
    ? JSON.stringify(member.education, null, 2)
    : "";
  const careerDefault = member?.career?.length
    ? JSON.stringify(member.career, null, 2)
    : "";

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-gray-700 px-2">
            기본 정보
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nameKo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이름 (한국어) <span className="text-red-500">*</span>
              </label>
              <input
                id="nameKo"
                name="nameKo"
                type="text"
                required
                defaultValue={member?.nameKo ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="nameEn"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이름 (영어) <span className="text-red-500">*</span>
              </label>
              <input
                id="nameEn"
                name="nameEn"
                type="text"
                required
                defaultValue={member?.nameEn ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="group"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                그룹 <span className="text-red-500">*</span>
              </label>
              <select
                id="group"
                name="group"
                required
                defaultValue={member?.group ?? "ms"}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
              >
                {GROUP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                직위 <span className="text-red-500">*</span>
              </label>
              <input
                id="position"
                name="position"
                type="text"
                required
                placeholder="예: 석사과정, 교수"
                defaultValue={member?.position ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                학과 <span className="text-red-500">*</span>
              </label>
              <input
                id="department"
                name="department"
                type="text"
                required
                defaultValue={member?.department ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={member?.email ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              프로필 이미지 URL
            </label>
            <input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/photo.jpg"
              defaultValue={member?.image ?? ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              소개
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={member?.bio ?? ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="researchKeywords"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                연구 키워드
              </label>
              <input
                id="researchKeywords"
                name="researchKeywords"
                type="text"
                placeholder="쉼표로 구분 (예: NLP, LLM, RAG)"
                defaultValue={member?.researchKeywords?.join(", ") ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                쉼표(,)로 구분하여 입력
              </p>
            </div>
            <div>
              <label
                htmlFor="displayOrder"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                표시 순서
              </label>
              <input
                id="displayOrder"
                name="displayOrder"
                type="number"
                min={0}
                defaultValue={member?.displayOrder ?? 0}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </fieldset>

        {/* Links */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-gray-700 px-2">
            외부 링크 (선택)
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["github", "scholar", "homepage", "orcid", "dblp"] as const).map(
              (field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-1 capitalize"
                  >
                    {field === "scholar"
                      ? "Google Scholar"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="url"
                    placeholder="https://..."
                    defaultValue={member?.links?.[field] ?? ""}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              ),
            )}
          </div>
        </fieldset>

        {/* Education */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-gray-700 px-2">
            학력 (선택)
          </legend>
          <div>
            <label
              htmlFor="education"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              학력 정보 (JSON)
            </label>
            <textarea
              id="education"
              name="education"
              rows={5}
              defaultValue={educationDefault}
              placeholder={`[
  { "degree": "박사", "institution": "서울대학교", "field": "컴퓨터공학", "year": "2020" }
]`}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-y"
            />
            <p className="mt-1 text-xs text-gray-500">
              JSON 배열 형식. 각 항목: degree, institution, field, year
            </p>
          </div>
        </fieldset>

        {/* Career */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-gray-700 px-2">
            경력 (선택)
          </legend>
          <div>
            <label
              htmlFor="career"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              경력 정보 (JSON)
            </label>
            <textarea
              id="career"
              name="career"
              rows={5}
              defaultValue={careerDefault}
              placeholder={`[
  { "period": "2020-2023", "role": "연구원", "organization": "KAIST" }
]`}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-y"
            />
            <p className="mt-1 text-xs text-gray-500">
              JSON 배열 형식. 각 항목: period, role, organization
            </p>
          </div>
        </fieldset>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/professor/members")}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
