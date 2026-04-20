// ── Browser-safe NAS utilities (no Node.js fs/path) ──────────────────────────
// This file is safe to import in "use client" components.

export type NasEntry = {
  name: string;
  /** Relative path from zone root, e.g. "/06. 연구자료/논문.pdf" */
  path: string;
  isDir: boolean;
  size: number;
  modifiedAt: string; // ISO string
  ext: string; // lowercase extension, e.g. "pdf"
};

export type PreviewType = "image" | "pdf" | "video" | "audio" | "text" | "office" | "none";

export function previewType(ext: string): PreviewType {
  const e = ext.toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(e)) return "image";
  if (e === "pdf") return "pdf";
  if (["mp4", "mov", "webm", "mkv"].includes(e)) return "video";
  if (["mp3", "m4a", "wav", "ogg", "flac", "aac"].includes(e)) return "audio";
  if (["txt", "md", "json", "js", "ts", "py", "csv", "log",
       "sh", "yaml", "yml", "xml", "html", "css", "tsx", "jsx"].includes(e)) return "text";
  if (["pptx", "ppt", "docx", "doc", "xlsx", "xls"].includes(e)) return "office";
  return "none";
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}
