import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { openFile, safeAbsPath, mimeFor, NasZone, NAS_ZONES } from "@/lib/nas/fs";
import { db } from "@/lib/db/drizzle";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Readable } from "stream";
import fsPromises from "fs/promises";
import path from "path";

// ── Session shape we care about ───────────────────────────────────────────────
type AppSession = {
  user: {
    role?: string;
    memberId?: number;
  };
} | null;

// ── Shared auth + path guard (mirrors /api/files/list) ───────────────────────
async function checkAccess(
  session: AppSession,
  zone: NasZone,
  subPath: string,
): Promise<NextResponse | null> {
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role ?? "";
  const isPrivileged = ["professor", "admin"].includes(role);

  if (zone === "개인" && !isPrivileged) {
    const memberId = session.user.memberId;
    if (!memberId) {
      return NextResponse.json({ error: "No member record" }, { status: 403 });
    }

    const [member] = await db
      .select({ nasFolderName: members.nasFolderName })
      .from(members)
      .where(eq(members.id, memberId))
      .limit(1);

    const allowedFolder = member?.nasFolderName;
    if (!allowedFolder) {
      return NextResponse.json({ error: "NAS folder not configured" }, { status: 403 });
    }

    const normalised = subPath.replace(/^\/+/, "");
    if (normalised !== allowedFolder && !normalised.startsWith(allowedFolder + "/")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
  }

  return null; // access granted
}

export async function GET(req: NextRequest) {
  const session = (await auth()) as AppSession;

  const zone = req.nextUrl.searchParams.get("zone") as NasZone | null;
  const subPath = req.nextUrl.searchParams.get("path") ?? "";
  const inline = req.nextUrl.searchParams.get("inline") === "1"; // preview vs download

  if (!zone || !(zone in NAS_ZONES)) {
    return NextResponse.json({ error: "Invalid zone" }, { status: 400 });
  }

  const denied = await checkAccess(session, zone, subPath);
  if (denied) return denied;

  // ── Resolve abs path ──────────────────────────────────────────────────────
  const rangeHeader = req.headers.get("range");

  try {
    const absPath = safeAbsPath(zone, subPath);
    const stat = await fsPromises.stat(absPath);
    if (stat.isDirectory()) throw new Error("Path is a directory");

    const name = path.basename(absPath);
    const ext = path.extname(name).slice(1).toLowerCase();
    const mimeType = mimeFor(ext);
    const size = stat.size;

    const headers: Record<string, string> = {
      "Content-Type": mimeType,
      "Cache-Control": "private, no-store",
      "Content-Disposition": inline
        ? `inline; filename*=UTF-8''${encodeURIComponent(name)}`
        : `attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Accept-Ranges": "bytes",
    };

    // ── Video: stream with Range support ────────────────────────────────────
    if (mimeType.startsWith("video/") && rangeHeader) {
      const [, rangeStr] = rangeHeader.split("=");
      const [startStr, endStr] = rangeStr.split("-");
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : size - 1;
      const chunkSize = end - start + 1;

      const { stream: rangeStream } = await openFile(zone, subPath, { start, end });
      headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
      headers["Content-Length"] = String(chunkSize);

      const webStream = Readable.toWeb(rangeStream) as ReadableStream;
      return new NextResponse(webStream, { status: 206, headers });
    }

    // ── All other files: read into buffer (reliable across environments) ────
    const buffer = await fsPromises.readFile(absPath);
    headers["Content-Length"] = String(buffer.byteLength);
    return new NextResponse(buffer, { status: 200, headers });

  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg.includes("ENOENT")) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    if (msg.includes("Invalid path")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
