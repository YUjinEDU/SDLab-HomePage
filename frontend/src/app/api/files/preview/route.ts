import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { safeAbsPath, NasZone, NAS_ZONES } from "@/lib/nas/fs";
import { db } from "@/lib/db/drizzle";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { convertToPdf, libreOfficeAvailable } from "@/lib/nas/convert";

type AppSession = { user: { role?: string; memberId?: number } } | null;

export async function GET(req: NextRequest) {
  const session = (await auth()) as AppSession;
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const zone = req.nextUrl.searchParams.get("zone") as NasZone | null;
  const subPath = req.nextUrl.searchParams.get("path") ?? "";

  if (!zone || !(zone in NAS_ZONES)) {
    return NextResponse.json({ error: "Invalid zone" }, { status: 400 });
  }

  // ── 개인 zone access control ──────────────────────────────────────────────
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

  // ── LibreOffice availability check ────────────────────────────────────────
  const hasLibreOffice = await libreOfficeAvailable();
  if (!hasLibreOffice) {
    return NextResponse.json(
      { error: "LibreOffice not available — deploy to Docker to use this feature" },
      { status: 503 },
    );
  }

  // ── Convert & serve ───────────────────────────────────────────────────────
  try {
    const absPath = safeAbsPath(zone, subPath);
    const pdfBuffer = await convertToPdf(absPath);
    const blob = new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" });

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(pdfBuffer.byteLength),
        // no-cache: browser must revalidate — server handles caching by mtime key
        "Cache-Control": "private, no-cache",
        "Content-Disposition": "inline",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";

    if (msg.includes("ENOENT")) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    if (msg.includes("Invalid path")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
    // Timeout: LibreOffice took too long (> 60s)
    if (msg.includes("ETIMEDOUT") || msg.includes("ERR_CHILD_PROCESS_KILLED")) {
      return NextResponse.json({ error: "Conversion timed out" }, { status: 504 });
    }

    // Do NOT expose raw filesystem paths or internal error details to client
    console.error("[preview] conversion error:", e);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
