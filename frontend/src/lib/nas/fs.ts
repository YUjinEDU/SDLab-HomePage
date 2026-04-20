// ── Server-only: Node.js fs access. Do NOT import in "use client" components. ─
import "server-only";
import path from "path";
import fs from "fs/promises";
import { createReadStream } from "fs";
import type { ReadStream } from "fs";

// ── Zone roots (injected via docker-compose environment) ──────────────────────
export const NAS_ZONES = {
  공용: process.env.NAS_SHARED_PATH ?? "/nas/공용",
  개인: process.env.NAS_PRIVATE_PATH ?? "/nas/개인",
} as const;

export type NasZone = keyof typeof NAS_ZONES;

// ── Path safety ───────────────────────────────────────────────────────────────
/**
 * Resolve a sub-path inside a zone root and verify it doesn't escape the root.
 * Throws if the resolved path escapes (path traversal attack prevention).
 */
export function safeAbsPath(zone: NasZone, subPath: string): string {
  // Normalize root with path.resolve so Windows forward slashes → backslashes
  const root = path.resolve(NAS_ZONES[zone]);
  const cleaned = subPath.replace(/^[/\\]+/, ""); // strip leading / or \
  const resolved = path.resolve(root, cleaned);

  // Must stay inside the zone root (both are now OS-native separators)
  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    throw new Error("Invalid path: access outside zone root is not allowed");
  }
  return resolved;
}

/** Strip the zone root prefix to get a display-friendly relative path. */
export function relPath(zone: NasZone, absPath: string): string {
  const root = path.resolve(NAS_ZONES[zone]);
  return absPath.slice(root.length).replace(/\\/g, "/");
}

// ── Re-export browser-safe types from utils ───────────────────────────────────
import type { NasEntry } from "./utils";
export type { NasEntry } from "./utils";
export { previewType, formatSize } from "./utils";

// ── Directory listing ─────────────────────────────────────────────────────────
export async function listDir(zone: NasZone, subPath: string): Promise<NasEntry[]> {
  const abs = safeAbsPath(zone, subPath);
  const raw = await fs.readdir(abs, { withFileTypes: true });

  const entries = await Promise.all(
    raw
      .filter((e) => !e.name.startsWith(".")) // skip hidden files (.DS_Store etc.)
      .map(async (e): Promise<NasEntry> => {
        const fullAbs = path.join(abs, e.name);
        const stat = await fs.stat(fullAbs).catch(() => null);
        const isDir = e.isDirectory();
        const ext = isDir ? "" : path.extname(e.name).slice(1).toLowerCase();

        return {
          name: e.name,
          path: relPath(zone, fullAbs),
          isDir,
          size: stat?.size ?? 0,
          modifiedAt: stat?.mtime.toISOString() ?? "",
          ext,
        };
      }),
  );

  // Directories first, then files; both sorted alphabetically
  return entries.sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.name.localeCompare(b.name, "ko");
  });
}

// ── File streaming ────────────────────────────────────────────────────────────
export type FileStreamResult = {
  stream: ReadStream;
  size: number;
  mimeType: string;
  name: string;
};

const MIME: Record<string, string> = {
  pdf:  "application/pdf",
  png:  "image/png",
  jpg:  "image/jpeg",
  jpeg: "image/jpeg",
  gif:  "image/gif",
  webp: "image/webp",
  mp4:  "video/mp4",
  mov:  "video/quicktime",
  mp3:  "audio/mpeg",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ppt:  "application/vnd.ms-powerpoint",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc:  "application/msword",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  hwp:  "application/x-hwp",
  zip:  "application/zip",
};

export function mimeFor(ext: string): string {
  return MIME[ext.toLowerCase()] ?? "application/octet-stream";
}

export async function openFile(
  zone: NasZone,
  subPath: string,
  range?: { start: number; end: number },
): Promise<FileStreamResult> {
  const abs = safeAbsPath(zone, subPath);
  const stat = await fs.stat(abs);

  if (stat.isDirectory()) throw new Error("Path is a directory, not a file");

  const name = path.basename(abs);
  const ext = path.extname(name).slice(1).toLowerCase();
  const mimeType = mimeFor(ext);
  const stream = createReadStream(abs, range);

  return { stream, size: stat.size, mimeType, name };
}

