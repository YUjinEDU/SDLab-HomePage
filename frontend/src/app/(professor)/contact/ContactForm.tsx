"use client";

import { useState } from "react";
import { updateContact } from "@/actions/contact";
import type { ContactInfo } from "@/types";

type ContactFormProps = {
  contact: ContactInfo;
};

export default function ContactForm({ contact }: ContactFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateContact(formData);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      setSuccess(true);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          연락처 정보가 저장되었습니다.
        </div>
      )}

      {/* 연구실 정보 */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          연구실 정보
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="labNameKo"
                className="block text-sm font-medium text-gray-700"
              >
                연구실명 (한글) *
              </label>
              <input
                id="labNameKo"
                name="labNameKo"
                type="text"
                required
                defaultValue={contact.labName.ko}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="labNameEn"
                className="block text-sm font-medium text-gray-700"
              >
                연구실명 (영문) *
              </label>
              <input
                id="labNameEn"
                name="labNameEn"
                type="text"
                required
                defaultValue={contact.labName.en}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="university"
                className="block text-sm font-medium text-gray-700"
              >
                대학교 *
              </label>
              <input
                id="university"
                name="university"
                type="text"
                required
                defaultValue={contact.university}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                학과 *
              </label>
              <input
                id="department"
                name="department"
                type="text"
                required
                defaultValue={contact.department}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 교수 정보 */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">교수 정보</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="professorName"
                className="block text-sm font-medium text-gray-700"
              >
                성함 *
              </label>
              <input
                id="professorName"
                name="professorName"
                type="text"
                required
                defaultValue={contact.professor.name}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="professorTitle"
                className="block text-sm font-medium text-gray-700"
              >
                직함 *
              </label>
              <input
                id="professorTitle"
                name="professorTitle"
                type="text"
                required
                defaultValue={contact.professor.title}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="professorEmail"
              className="block text-sm font-medium text-gray-700"
            >
              이메일 *
            </label>
            <input
              id="professorEmail"
              name="professorEmail"
              type="email"
              required
              defaultValue={contact.professor.email}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="professorPhone"
              className="block text-sm font-medium text-gray-700"
            >
              교수 전화번호
            </label>
            <input
              id="professorPhone"
              name="professorPhone"
              type="tel"
              defaultValue={contact.location.professorPhone}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>
      </section>

      {/* 위치 정보 */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">위치 정보</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              주소 *
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              defaultValue={contact.address}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="building"
                className="block text-sm font-medium text-gray-700"
              >
                건물 *
              </label>
              <input
                id="building"
                name="building"
                type="text"
                required
                defaultValue={contact.location.building}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="professorOffice"
                className="block text-sm font-medium text-gray-700"
              >
                교수 연구실
              </label>
              <input
                id="professorOffice"
                name="professorOffice"
                type="text"
                defaultValue={contact.location.professorOffice}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="labRoom"
                className="block text-sm font-medium text-gray-700"
              >
                연구실 호실
              </label>
              <input
                id="labRoom"
                name="labRoom"
                type="text"
                defaultValue={contact.location.lab}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="labPhone"
              className="block text-sm font-medium text-gray-700"
            >
              연구실 전화번호
            </label>
            <input
              id="labPhone"
              name="labPhone"
              type="tel"
              defaultValue={contact.location.labPhone}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="mapEmbedUrl"
              className="block text-sm font-medium text-gray-700"
            >
              지도 임베드 URL
            </label>
            <input
              id="mapEmbedUrl"
              name="mapEmbedUrl"
              type="url"
              defaultValue={contact.mapEmbedUrl ?? ""}
              placeholder="https://www.google.com/maps/embed?..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Google Maps 임베드 URL을 입력하세요. 비워두면 지도가 표시되지
              않습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 버튼 */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
        >
          {submitting ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
