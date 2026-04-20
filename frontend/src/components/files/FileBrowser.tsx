"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { NasEntry } from "@/lib/nas/utils";
import { previewType, formatSize } from "@/lib/nas/utils";

type Zone = "공용" | "개인";

type Props = {
  defaultZone?: Zone;
  /** For regular members: their NAS folder name — browser starts inside it */
  memberFolder?: string;
  isPrivileged: boolean; // professor | admin can see all 개인 folders
};

// ── Icons (inline SVG keeps bundle lean) ──────────────────────────────────────
function FolderIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  );
}

function FileIcon({ ext }: { ext: string }) {
  const colors: Record<string, string> = {
    pdf: "text-red-500",
    pptx: "text-orange-500", ppt: "text-orange-500",
    docx: "text-blue-500",   doc: "text-blue-500",
    xlsx: "text-green-500",
    mp4:  "text-purple-500", mov: "text-purple-500",
    jpg:  "text-pink-500",   jpeg: "text-pink-500",
    png:  "text-pink-500",   webp: "text-pink-500",
    hwp:  "text-sky-500",
  };
  return (
    <svg className={`w-5 h-5 shrink-0 ${colors[ext] ?? "text-gray-400"}`} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

// ── Blob URL hook ─────────────────────────────────────────────────────────────
function useBlobUrl(apiSrc: string, enabled: boolean) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let url: string;
    setLoading(true);
    setError(null);

    fetch(apiSrc)
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류 ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "불러오기 실패"))
      .finally(() => setLoading(false));

    return () => {
      if (url) URL.revokeObjectURL(url);
      setBlobUrl(null);
    };
  }, [apiSrc, enabled]);

  return { blobUrl, loading, error };
}

// ── Text content hook ─────────────────────────────────────────────────────────
function useTextContent(apiSrc: string, enabled: boolean) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    setText(null);

    fetch(apiSrc)
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류 ${res.status}`);
        return res.text();
      })
      .then(setText)
      .catch((e) => setError(e instanceof Error ? e.message : "불러오기 실패"))
      .finally(() => setLoading(false));
  }, [apiSrc, enabled]);

  return { text, loading, error };
}

// ── Preview modal ─────────────────────────────────────────────────────────────
function PreviewModal({
  entry,
  zone,
  onClose,
}: {
  entry: NasEntry;
  zone: Zone;
  onClose: () => void;
}) {
  const apiSrc = `/api/files/download?zone=${encodeURIComponent(zone)}&path=${encodeURIComponent(entry.path)}&inline=1`;
  const downloadHref = `/api/files/download?zone=${encodeURIComponent(zone)}&path=${encodeURIComponent(entry.path)}`;
  const pt = previewType(entry.ext);

  const previewSrc = `/api/files/preview?zone=${encodeURIComponent(zone)}&path=${encodeURIComponent(entry.path)}`;
  const needsBlob = pt === "image" || pt === "pdf" || pt === "video" || pt === "audio" || pt === "office";
  const blobSrc = pt === "office" ? previewSrc : apiSrc;
  const { blobUrl, loading: blobLoading, error: blobError } = useBlobUrl(blobSrc, needsBlob);
  const { text, loading: textLoading, error: textError } = useTextContent(apiSrc, pt === "text");

  const loading = blobLoading || textLoading;
  const error = blobError || textError;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-medium text-gray-800 truncate">{entry.name}</span>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <a
              href={downloadHref}
              download={entry.name}
              className="text-sm px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              다운로드
            </a>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 min-h-[400px]">
          {loading && (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm animate-pulse">
              파일 불러오는 중…
            </div>
          )}
          {!loading && error && (
            <div className="flex items-center justify-center h-48 text-red-500 text-sm">
              {error}
            </div>
          )}
          {pt === "image" && blobUrl && (
            <img src={blobUrl} alt={entry.name} className="max-w-full max-h-[75vh] object-contain mx-auto block p-4" />
          )}
          {pt === "pdf" && blobUrl && (
            <iframe src={blobUrl} className="w-full h-[75vh] border-0" title={entry.name} />
          )}
          {pt === "video" && blobUrl && (
            <video controls src={blobUrl} className="w-full max-h-[75vh]" />
          )}
          {pt === "audio" && blobUrl && (
            <div className="flex flex-col items-center justify-center h-48 gap-4 p-6">
              <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <audio controls src={blobUrl} className="w-full max-w-md" />
            </div>
          )}
          {pt === "text" && text !== null && (
            <pre className="p-4 text-xs font-mono text-gray-800 whitespace-pre-wrap break-words overflow-auto max-h-[75vh] bg-gray-50">
              {text}
            </pre>
          )}
          {pt === "office" && blobUrl && (
            <iframe src={blobUrl} className="w-full h-[75vh] border-0" title={entry.name} />
          )}
          {pt === "office" && !blobLoading && blobError && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="text-sm text-center text-gray-500">
                {blobError.includes("503") ? "Docker 배포 환경에서만 지원됩니다." : "변환 실패: " + blobError}
              </p>
              <a href={downloadHref} download={entry.name}
                className="text-sm px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                다운로드
              </a>
            </div>
          )}
          {pt === "none" && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
              <FileIcon ext={entry.ext} />
              <p className="text-sm">미리보기를 지원하지 않는 파일 형식입니다.</p>
              <a
                href={downloadHref}
                download={entry.name}
                className="text-sm px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                다운로드
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function FileBrowser({ defaultZone = "공용", memberFolder, isPrivileged }: Props) {
  const [zone, setZone] = useState<Zone>(defaultZone);
  const [currentPath, setCurrentPath] = useState("");
  const [entries, setEntries] = useState<NasEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<NasEntry | null>(null);

  // ── Upload state ───────────────────────────────────────────────────────────
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Rename state ───────────────────────────────────────────────────────────
  const [renamingEntry, setRenamingEntry] = useState<NasEntry | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // ── Mkdir state ────────────────────────────────────────────────────────────
  const [mkdirOpen, setMkdirOpen] = useState(false);
  const [mkdirName, setMkdirName] = useState("");
  const [mkdirError, setMkdirError] = useState<string | null>(null);
  const [mkdirPending, setMkdirPending] = useState(false);
  const mkdirInputRef = useRef<HTMLInputElement>(null);

  // ── Action error (delete / rename) ────────────────────────────────────────
  const [actionError, setActionError] = useState<string | null>(null);

  // Upload allowed: 공용 → professor/admin; 개인 → anyone with an assigned folder
  const canUpload = zone === "개인" ? (isPrivileged || !!memberFolder) : isPrivileged;
  // Manage (delete / rename) follows same rule as upload
  const canManage = canUpload;

  const fetchDir = useCallback(async (z: Zone, p: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/files/list?zone=${encodeURIComponent(z)}&path=${encodeURIComponent(p)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "불러오기 실패");
      setEntries(data.entries ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialPath =
      zone === "개인" && !isPrivileged && memberFolder ? memberFolder : "";
    setCurrentPath(initialPath);
    fetchDir(zone, initialPath);
    // Reset UI state on zone change
    setMkdirOpen(false);
    setRenamingEntry(null);
    setActionError(null);
  }, [zone, memberFolder, isPrivileged, fetchDir]);

  // Focus rename input when entering rename mode
  useEffect(() => {
    if (renamingEntry) {
      setTimeout(() => renameInputRef.current?.select(), 50);
    }
  }, [renamingEntry]);

  // Focus mkdir input when opening
  useEffect(() => {
    if (mkdirOpen) {
      setTimeout(() => mkdirInputRef.current?.focus(), 50);
    }
  }, [mkdirOpen]);

  // ── Upload handler ─────────────────────────────────────────────────────────
  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files);
      if (!fileArr.length) return;

      setUploading(true);
      setUploadError(null);
      setUploadSuccess(null);
      setUploadProgress(0);

      let failed = 0;
      let lastError = "";

      for (let i = 0; i < fileArr.length; i++) {
        const file = fileArr[i];
        const formData = new FormData();
        formData.append("zone", zone);
        formData.append("subpath", currentPath);
        formData.append("file", file);

        try {
          const res = await fetch("/api/files/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (!res.ok) {
            failed++;
            lastError = data.error ?? "업로드 실패";
          }
        } catch {
          failed++;
          lastError = "네트워크 오류";
        }
        setUploadProgress(Math.round(((i + 1) / fileArr.length) * 100));
      }

      setUploading(false);
      if (failed > 0) {
        setUploadError(lastError);
      } else {
        const label = fileArr.length === 1 ? fileArr[0].name : `${fileArr.length}개 파일`;
        setUploadSuccess(`${label} 업로드 완료`);
        setTimeout(() => setUploadSuccess(null), 3000);
        fetchDir(zone, currentPath);
      }
    },
    [zone, currentPath, fetchDir],
  );

  // ── Delete handler ─────────────────────────────────────────────────────────
  const handleDelete = useCallback(
    async (entry: NasEntry) => {
      const label = entry.isDir
        ? `"${entry.name}" 폴더(내부 파일 포함)를`
        : `"${entry.name}" 파일을`;
      if (!confirm(`${label} 삭제하시겠습니까?`)) return;

      setActionError(null);
      try {
        const res = await fetch("/api/files/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ zone, path: entry.path }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "삭제 실패");
        fetchDir(zone, currentPath);
      } catch (e) {
        setActionError(e instanceof Error ? e.message : "삭제 실패");
      }
    },
    [zone, currentPath, fetchDir],
  );

  // ── Rename handlers ────────────────────────────────────────────────────────
  function startRename(entry: NasEntry) {
    setRenamingEntry(entry);
    setRenameValue(entry.name);
    setRenameError(null);
  }

  const commitRename = useCallback(async () => {
    if (!renamingEntry) return;
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === renamingEntry.name) {
      setRenamingEntry(null);
      return;
    }
    setRenameError(null);
    try {
      const res = await fetch("/api/files/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zone, path: renamingEntry.path, newName: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "이름 변경 실패");
      setRenamingEntry(null);
      fetchDir(zone, currentPath);
    } catch (e) {
      setRenameError(e instanceof Error ? e.message : "이름 변경 실패");
    }
  }, [renamingEntry, renameValue, zone, currentPath, fetchDir]);

  // ── Mkdir handler ──────────────────────────────────────────────────────────
  const handleMkdir = useCallback(async () => {
    const trimmed = mkdirName.trim();
    if (!trimmed) return;
    setMkdirPending(true);
    setMkdirError(null);
    try {
      const res = await fetch("/api/files/mkdir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zone, parentPath: currentPath, name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "폴더 생성 실패");
      setMkdirOpen(false);
      setMkdirName("");
      fetchDir(zone, currentPath);
    } catch (e) {
      setMkdirError(e instanceof Error ? e.message : "폴더 생성 실패");
    } finally {
      setMkdirPending(false);
    }
  }, [zone, currentPath, mkdirName, fetchDir]);

  // ── Drag & drop ────────────────────────────────────────────────────────────
  function handleDragOver(e: React.DragEvent) {
    if (!canUpload) return;
    e.preventDefault();
    setIsDragging(true);
  }
  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (canUpload && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }

  // ── Zone switch ────────────────────────────────────────────────────────────
  function switchZone(z: Zone) {
    setZone(z);
    setUploadError(null);
    setUploadSuccess(null);
    setActionError(null);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  function openFolder(entry: NasEntry) {
    setCurrentPath(entry.path);
    fetchDir(zone, entry.path);
  }

  function navigateTo(p: string) {
    setCurrentPath(p);
    fetchDir(zone, p);
  }

  // ── Breadcrumb ─────────────────────────────────────────────────────────────
  const breadcrumbs = (() => {
    const parts = currentPath.replace(/^\//, "").split("/").filter(Boolean);
    const startIndex = !isPrivileged && memberFolder ? 1 : 0;
    const crumbs = [{
      label: zone === "공용" ? "공용" : !isPrivileged ? "내 폴더" : "개인",
      path: !isPrivileged && memberFolder ? memberFolder : "",
    }];

    let acc = "";
    parts.slice(startIndex).forEach((part) => {
      acc = acc ? `${acc}/${part}` : part;
      const fullPath = !isPrivileged && memberFolder ? `${memberFolder}/${acc}` : acc;
      crumbs.push({ label: part, path: fullPath });
    });

    return crumbs;
  })();

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Zone tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-4">
        {(["공용", "개인"] as Zone[]).map((z) => (
          <button
            key={z}
            onClick={() => switchZone(z)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              zone === z
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {z === "공용" ? "📁 공용 폴더" : "🔒 개인 폴더"}
          </button>
        ))}
      </div>

      {/* Toolbar: breadcrumb + action buttons */}
      <div className="flex items-center justify-between mb-3 gap-2">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap min-w-0">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-300">/</span>}
              {i < breadcrumbs.length - 1 ? (
                <button
                  onClick={() => navigateTo(crumb.path)}
                  className="hover:text-emerald-700 transition-colors"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-gray-800 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Action buttons */}
        {canUpload && (
          <div className="flex items-center gap-2 shrink-0">
            {/* New folder */}
            <button
              onClick={() => { setMkdirOpen(true); setMkdirName(""); setMkdirError(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              새 폴더
            </button>

            {/* Upload */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 transition-colors"
            >
              <UploadIcon />
              {uploading ? `업로드 중… ${uploadProgress}%` : "파일 업로드"}
            </button>
          </div>
        )}
      </div>

      {/* Mkdir inline form */}
      {mkdirOpen && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <input
            ref={mkdirInputRef}
            type="text"
            value={mkdirName}
            onChange={(e) => setMkdirName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleMkdir();
              if (e.key === "Escape") { setMkdirOpen(false); setMkdirName(""); }
            }}
            placeholder="새 폴더 이름"
            className="flex-1 text-sm rounded-md border border-emerald-200 bg-white px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-400"
          />
          <button
            onClick={handleMkdir}
            disabled={mkdirPending || !mkdirName.trim()}
            className="text-sm px-3 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {mkdirPending ? "생성 중…" : "만들기"}
          </button>
          <button
            onClick={() => { setMkdirOpen(false); setMkdirName(""); setMkdirError(null); }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
          {mkdirError && <span className="text-xs text-red-500">{mkdirError}</span>}
        </div>
      )}

      {/* Feedback banners */}
      {uploadSuccess && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {uploadSuccess}
        </div>
      )}
      {uploadError && (
        <div className="mb-2 flex items-center justify-between rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="ml-2 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}
      {actionError && (
        <div className="mb-2 flex items-center justify-between rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="ml-2 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* File list with drag & drop */}
      <div
        className={`flex-1 overflow-auto border rounded-lg bg-white transition-colors ${
          isDragging
            ? "border-emerald-400 bg-emerald-50 border-2 border-dashed"
            : "border-gray-200"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 rounded-xl px-6 py-4 shadow-lg text-emerald-700 font-medium text-sm flex items-center gap-2">
              <UploadIcon />
              여기에 놓으면 업로드됩니다
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            불러오는 중…
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-32 text-red-500 text-sm">
            {error}
          </div>
        )}
        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-sm gap-2">
            <p>폴더가 비어 있습니다.</p>
            {canUpload && (
              <p className="text-xs text-gray-300">파일을 드래그하거나 업로드 버튼을 눌러보세요.</p>
            )}
          </div>
        )}
        {!loading && !error && entries.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500 text-xs">
                <th className="text-left px-4 py-2 font-medium w-full">이름</th>
                <th className="text-right px-4 py-2 font-medium whitespace-nowrap">크기</th>
                <th className="text-right px-4 py-2 font-medium whitespace-nowrap hidden sm:table-cell">
                  수정일
                </th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const isRenaming = renamingEntry?.path === entry.path;
                return (
                  <tr
                    key={entry.path}
                    className="border-b last:border-0 hover:bg-gray-50 transition-colors group"
                  >
                    {/* Name cell — inline rename when active */}
                    <td className="px-4 py-2">
                      {isRenaming ? (
                        <div className="flex items-center gap-2">
                          {entry.isDir ? <FolderIcon /> : <FileIcon ext={entry.ext} />}
                          <input
                            ref={renameInputRef}
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitRename();
                              if (e.key === "Escape") setRenamingEntry(null);
                            }}
                            className="flex-1 text-sm rounded border border-emerald-300 px-2 py-0.5 outline-none focus:ring-1 focus:ring-emerald-400 min-w-0"
                          />
                          <button
                            onClick={commitRename}
                            className="text-xs px-2 py-0.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 shrink-0"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => setRenamingEntry(null)}
                            className="text-gray-400 hover:text-gray-600 text-xs shrink-0"
                          >
                            취소
                          </button>
                          {renameError && (
                            <span className="text-xs text-red-500 shrink-0">{renameError}</span>
                          )}
                        </div>
                      ) : (
                        <button
                          className="flex items-center gap-2 text-left w-full"
                          onClick={() => {
                            if (entry.isDir) openFolder(entry);
                            else setPreview(entry);
                          }}
                        >
                          {entry.isDir ? <FolderIcon /> : <FileIcon ext={entry.ext} />}
                          <span className={entry.isDir ? "font-medium text-gray-800" : "text-gray-700"}>
                            {entry.name}
                          </span>
                        </button>
                      )}
                    </td>

                    <td className="px-4 py-2 text-right text-gray-400 whitespace-nowrap">
                      {entry.isDir ? "—" : formatSize(entry.size)}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-400 whitespace-nowrap hidden sm:table-cell">
                      {new Date(entry.modifiedAt).toLocaleDateString("ko-KR")}
                    </td>

                    {/* Actions column */}
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Download (files only) */}
                        {!entry.isDir && (
                          <a
                            href={`/api/files/download?zone=${encodeURIComponent(zone)}&path=${encodeURIComponent(entry.path)}`}
                            download={entry.name}
                            className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            받기
                          </a>
                        )}
                        {/* Rename */}
                        {canManage && !isRenaming && (
                          <button
                            onClick={(e) => { e.stopPropagation(); startRename(entry); }}
                            title="이름 바꾸기"
                            className="p-1 rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                        {/* Delete */}
                        {canManage && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(entry); }}
                            title="삭제"
                            className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Preview modal */}
      {preview && (
        <PreviewModal entry={preview} zone={zone} onClose={() => setPreview(null)} />
      )}
    </div>
  );
}
