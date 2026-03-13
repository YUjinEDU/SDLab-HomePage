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

type EducationEntry = Member["education"][number];
type CareerEntry = Member["career"][number];

export function MemberForm({ member, action, title }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [educationList, setEducationList] = useState<EducationEntry[]>(
    member?.education?.length ? member.education : [],
  );
  const [careerList, setCareerList] = useState<CareerEntry[]>(
    member?.career?.length ? member.career : [],
  );

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

        {/* Hidden inputs to serialize education/career as JSON */}
        <input
          type="hidden"
          name="education"
          value={JSON.stringify(educationList)}
        />
        <input type="hidden" name="career" value={JSON.stringify(careerList)} />

        {/* Education */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-gray-700 px-2">
            학력 (선택)
          </legend>

          {educationList.length === 0 && (
            <p className="text-sm text-gray-400">등록된 학력이 없습니다.</p>
          )}

          {educationList.map((entry, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end border-b border-gray-100 pb-4 last:border-0"
            >
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  학위
                </label>
                <input
                  type="text"
                  value={entry.degree}
                  onChange={(e) => {
                    const next = [...educationList];
                    next[idx] = { ...next[idx], degree: e.target.value };
                    setEducationList(next);
                  }}
                  placeholder="학사 / 석사 / 박사"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  학교
                </label>
                <input
                  type="text"
                  value={entry.institution}
                  onChange={(e) => {
                    const next = [...educationList];
                    next[idx] = { ...next[idx], institution: e.target.value };
                    setEducationList(next);
                  }}
                  placeholder="충남대학교"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  전공
                </label>
                <input
                  type="text"
                  value={entry.field}
                  onChange={(e) => {
                    const next = [...educationList];
                    next[idx] = { ...next[idx], field: e.target.value };
                    setEducationList(next);
                  }}
                  placeholder="컴퓨터공학"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  기간
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={entry.year}
                    onChange={(e) => {
                      const next = [...educationList];
                      next[idx] = { ...next[idx], year: e.target.value };
                      setEducationList(next);
                    }}
                    placeholder="2020 - 2024"
                    className="w-full min-w-[120px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setEducationList(
                        educationList.filter((_, i) => i !== idx),
                      )
                    }
                    className="shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="삭제"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setEducationList([
                ...educationList,
                { degree: "", institution: "", field: "", year: "" },
              ])
            }
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
            학력 추가
          </button>
        </fieldset>

        {/* Career */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-gray-700 px-2">
            경력 (선택)
          </legend>

          {careerList.length === 0 && (
            <p className="text-sm text-gray-400">등록된 경력이 없습니다.</p>
          )}

          {careerList.map((entry, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-[120px_1fr_1fr_1fr_auto] gap-3 items-end border-b border-gray-100 pb-4 last:border-0"
            >
              {/* 구분 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  구분
                </label>
                <select
                  value={entry.category ?? "career"}
                  onChange={(e) => {
                    const next = [...careerList];
                    next[idx] = {
                      ...next[idx],
                      category: e.target.value as CareerEntry["category"],
                    };
                    setCareerList(next);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="career">경력</option>
                  <option value="award">수상</option>
                  <option value="academic_service">학술활동</option>
                </select>
              </div>
              {/* 기간 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  기간
                </label>
                <input
                  type="text"
                  value={entry.period}
                  onChange={(e) => {
                    const next = [...careerList];
                    next[idx] = { ...next[idx], period: e.target.value };
                    setCareerList(next);
                  }}
                  placeholder="2020 - 2023"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              {/* 직책/역할 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  직책/역할
                </label>
                <input
                  type="text"
                  value={entry.role}
                  onChange={(e) => {
                    const next = [...careerList];
                    next[idx] = { ...next[idx], role: e.target.value };
                    setCareerList(next);
                  }}
                  placeholder="연구원"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              {/* 소속 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  소속
                </label>
                <input
                  type="text"
                  value={entry.organization}
                  onChange={(e) => {
                    const next = [...careerList];
                    next[idx] = { ...next[idx], organization: e.target.value };
                    setCareerList(next);
                  }}
                  placeholder="충남대학교"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              {/* 삭제 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 invisible">
                  삭제
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setCareerList(careerList.filter((_, i) => i !== idx))
                  }
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="삭제"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setCareerList([
                ...careerList,
                { period: "", role: "", organization: "" },
              ])
            }
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
            경력 추가
          </button>
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
