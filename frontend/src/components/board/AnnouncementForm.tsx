"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useRef } from "react";
import type { AnnouncementRow } from "@/lib/queries/announcements";
import { addAttachment } from "@/actions/announcements";
import { TiptapEditor } from "./TiptapEditor";

type NasFile = { name: string; path: string; size: number };

type Props = {
  announcement?: AnnouncementRow;
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean; id?: number }>;
  title: string;
  backHref: string;
};

export function AnnouncementForm({ announcement, action, title, backHref }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState(announcement?.content ?? "");

  // 직접 업로드
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // NAS 파일 선택
  const [nasFiles, setNasFiles] = useState<NasFile[]>([]);
  const [selectedNasFiles, setSelectedNasFiles] = useState<NasFile[]>([]);
  const [showNasPicker, setShowNasPicker] = useState(false);
  const [loadingNas, setLoadingNas] = useState(false);

  function handleLocalFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setLocalFiles((prev) => [...prev, ...selected]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function openNasPicker() {
    setShowNasPicker(true);
    if (nasFiles.length > 0) return;
    setLoadingNas(true);
    try {
      const res = await fetch("/api/board-upload/nas-files");
      const data = await res.json();
      setNasFiles(data.files ?? []);
    } finally {
      setLoadingNas(false);
    }
  }

  function toggleNasFile(f: NasFile) {
    setSelectedNasFiles((prev) =>
      prev.some((x) => x.path === f.path)
        ? prev.filter((x) => x.path !== f.path)
        : [...prev, f]
    );
  }

  async function uploadFiles(announcementId: number) {
    for (const file of localFiles) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/board-upload", { method: "POST", body: fd });
      if (!res.ok) continue;
      const data = await res.json();
      await addAttachment(announcementId, {
        fileName: data.fileName,
        filePath: data.filePath,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
      });
    }
    for (const f of selectedNasFiles) {
      await addAttachment(announcementId, {
        fileName: f.name,
        filePath: f.path,
        fileSize: f.size,
      });
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    startTransition(async () => {
      setError(null);
      const result = await action(formData);
      if (result.error) {
        setError(result.error);
      } else {
        const hasAttachments = localFiles.length > 0 || selectedNasFiles.length > 0;
        if (hasAttachments && result.id) {
          await uploadFiles(result.id);
        }
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
            <input type="hidden" name="content" value={content} />
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="내용을 입력하세요..."
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

        {/* 첨부파일 */}
        <fieldset className="rounded-xl border border-border bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-text-secondary px-2">첨부파일</legend>

          {/* 직접 업로드 */}
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1.5">직접 업로드</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleLocalFileChange}
              className="block w-full text-sm text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-surface file:text-text-secondary hover:file:bg-border cursor-pointer"
            />
            {localFiles.length > 0 && (
              <ul className="mt-2 space-y-1">
                {localFiles.map((f, i) => (
                  <li key={i} className="flex items-center justify-between text-sm bg-surface rounded-lg px-3 py-1.5">
                    <span className="truncate text-text-secondary">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setLocalFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="ml-2 text-red-400 hover:text-red-600 shrink-0 text-xs"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* NAS 파일 선택 */}
          <div>
            <p className="text-xs font-medium text-text-secondary mb-1.5">NAS에서 선택</p>
            <button
              type="button"
              onClick={openNasPicker}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-border transition-colors"
            >
              NAS 파일 목록 열기
            </button>

            {showNasPicker && (
              <div className="mt-2 rounded-lg border border-border bg-white max-h-48 overflow-y-auto">
                {loadingNas ? (
                  <p className="px-3 py-4 text-sm text-text-secondary text-center">불러오는 중...</p>
                ) : nasFiles.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-text-secondary text-center">파일이 없습니다.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {nasFiles.map((f) => {
                      const checked = selectedNasFiles.some((x) => x.path === f.path);
                      return (
                        <li key={f.path}>
                          <label className="flex items-center gap-3 px-3 py-2 hover:bg-surface cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleNasFile(f)}
                              className="h-4 w-4 rounded border-border text-primary"
                            />
                            <span className="text-sm text-text-secondary truncate flex-1">{f.name}</span>
                            <span className="text-xs text-text-secondary shrink-0">
                              {(f.size / 1024).toFixed(0)}KB
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            {selectedNasFiles.length > 0 && (
              <ul className="mt-2 space-y-1">
                {selectedNasFiles.map((f) => (
                  <li key={f.path} className="flex items-center justify-between text-sm bg-emerald-50 rounded-lg px-3 py-1.5">
                    <span className="truncate text-text-secondary">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedNasFiles((prev) => prev.filter((x) => x.path !== f.path))}
                      className="ml-2 text-red-400 hover:text-red-600 shrink-0 text-xs"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
