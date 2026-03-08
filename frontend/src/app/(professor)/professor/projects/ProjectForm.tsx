"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/actions/projects";
import type { Project, ProjectStatus } from "@/types";
import type { Member } from "@/types";
import type { ResearchArea } from "@/types";

type ProjectFormProps = {
  project?: Project | null;
  members: Member[];
  researchAreas: ResearchArea[];
};

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "planned", label: "계획" },
  { value: "active", label: "진행중" },
  { value: "completed", label: "완료" },
  { value: "archived", label: "보관" },
];

export default function ProjectForm({
  project,
  members,
  researchAreas,
}: ProjectFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!project;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = isEdit
      ? await updateProject(project!.id, formData)
      : await createProject(formData);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      router.push("/professor/projects");
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
              프로젝트명 *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={project?.title ?? ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                상태 *
              </label>
              <select
                id="status"
                name="status"
                required
                defaultValue={project?.status ?? "active"}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                분류 *
              </label>
              <input
                id="category"
                name="category"
                type="text"
                required
                defaultValue={project?.category ?? ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="shortDescription"
              className="block text-sm font-medium text-gray-700"
            >
              짧은 설명 *
            </label>
            <input
              id="shortDescription"
              name="shortDescription"
              type="text"
              required
              defaultValue={project?.shortDescription ?? ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="fullDescription"
              className="block text-sm font-medium text-gray-700"
            >
              상세 설명
            </label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              rows={5}
              defaultValue={project?.fullDescription ?? ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>
      </section>

      {/* 사업 정보 */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">사업 정보</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="organization"
              className="block text-sm font-medium text-gray-700"
            >
              수행 기관 *
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              required
              defaultValue={project?.organization ?? ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="programType"
                className="block text-sm font-medium text-gray-700"
              >
                사업 유형
              </label>
              <input
                id="programType"
                name="programType"
                type="text"
                defaultValue={project?.programType ?? ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-medium text-gray-700"
              >
                예산
              </label>
              <input
                id="budget"
                name="budget"
                type="text"
                defaultValue={project?.budget ?? ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                시작일 *
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                defaultValue={project?.startDate ?? ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                종료일
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={project?.endDate ?? ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              태그 (쉼표로 구분)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              defaultValue={project?.tags.join(", ") ?? ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="demoUrl"
              className="block text-sm font-medium text-gray-700"
            >
              데모 URL
            </label>
            <input
              id="demoUrl"
              name="demoUrl"
              type="url"
              defaultValue={project?.demoUrl ?? ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              defaultChecked={project?.isFeatured ?? false}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label
              htmlFor="isFeatured"
              className="text-sm font-medium text-gray-700"
            >
              주요 프로젝트로 표시
            </label>
          </div>
        </div>
      </section>

      {/* 관계 설정 */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">관계 설정</h2>
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">참여 멤버</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {members.map((m) => (
                <label key={m.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="memberIds"
                    value={m.id}
                    defaultChecked={project?.memberIds.includes(m.id)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  {m.nameKo} ({m.nameEn})
                </label>
              ))}
            </div>
            {members.length === 0 && (
              <p className="text-sm text-gray-500">등록된 멤버가 없습니다.</p>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">연구 분야</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {researchAreas.map((area) => (
                <label
                  key={area.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    name="researchAreaIds"
                    value={area.id}
                    defaultChecked={project?.researchAreaIds.includes(area.id)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  {area.title}
                </label>
              ))}
            </div>
            {researchAreas.length === 0 && (
              <p className="text-sm text-gray-500">
                등록된 연구 분야가 없습니다.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 버튼 */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/professor/projects")}
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
