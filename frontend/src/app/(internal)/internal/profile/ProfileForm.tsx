"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Member } from "@/types";
import { updateMyProfile } from "@/actions/profile";

type Props = {
  member: Member;
};

export function ProfileForm({ member }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      setError(null);
      setSuccess(false);
      const result = await updateMyProfile(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  }

  const educationDefault = member.education?.length
    ? JSON.stringify(member.education, null, 2)
    : "";
  const careerDefault = member.career?.length
    ? JSON.stringify(member.career, null, 2)
    : "";

  const GROUP_LABELS: Record<string, string> = {
    professor: "지도교수",
    phd: "박사과정",
    ms: "석사과정",
    undergraduate: "학부연구생",
    alumni: "졸업생",
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">내 프로필</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          프로필이 저장되었습니다.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Read-only basic info */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-gray-700 px-2">
            기본 정보 (읽기 전용)
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 (한국어)
              </label>
              <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700">
                {member.nameKo}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 (영어)
              </label>
              <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700">
                {member.nameEn}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                소속
              </label>
              <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700">
                {GROUP_LABELS[member.group] ?? member.group} /{" "}
                {member.department}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                직위
              </label>
              <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700">
                {member.position}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700">
              {member.email ?? "-"}
            </div>
          </div>

          <p className="text-xs text-gray-500">
            이름, 소속, 직위, 이메일 변경은 관리자에게 요청하세요.
          </p>
        </fieldset>

        {/* Section 2: Editable profile */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-gray-700 px-2">
            프로필 편집
          </legend>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              프로필 이미지 URL
            </label>
            {member.image && (
              <div className="mb-2">
                <img
                  src={member.image}
                  alt="현재 프로필 이미지"
                  className="w-20 h-20 rounded-full object-cover border border-gray-200"
                />
              </div>
            )}
            <input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/photo.jpg"
              defaultValue={member.image ?? ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              자기소개
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={member.bio ?? ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none resize-y"
            />
          </div>

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
              defaultValue={member.researchKeywords?.join(", ") ?? ""}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              쉼표(,)로 구분하여 입력
            </p>
          </div>
        </fieldset>

        {/* Section 3: Links */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-gray-700 px-2">
            링크 (선택)
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              [
                { key: "github", label: "GitHub" },
                { key: "scholar", label: "Google Scholar" },
                { key: "homepage", label: "Homepage" },
                { key: "orcid", label: "ORCID" },
                { key: "dblp", label: "DBLP" },
              ] as const
            ).map((field) => (
              <div key={field.key}>
                <label
                  htmlFor={field.key}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                </label>
                <input
                  id={field.key}
                  name={field.key}
                  type="url"
                  placeholder="https://..."
                  defaultValue={member.links?.[field.key] ?? ""}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
                />
              </div>
            ))}
          </div>
        </fieldset>

        {/* Section 4: Education & Career */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-gray-700 px-2">
            학력 &amp; 경력 (선택)
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none resize-y"
            />
            <p className="mt-1 text-xs text-gray-500">
              JSON 배열 형식. 각 항목: degree, institution, field, year
            </p>
          </div>

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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none resize-y"
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
            className="rounded-lg bg-slate-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/internal")}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
