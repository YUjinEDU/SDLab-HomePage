import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { listDir, NasZone, NAS_ZONES } from "@/lib/nas/fs";
import { db } from "@/lib/db/drizzle";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type AppSession = {
  user: { role?: string; memberId?: number };
} | null;

export async function GET(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const session = (await auth()) as AppSession;
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role ?? "";
  const isPrivileged = ["professor", "admin"].includes(role);

  // ── Params ────────────────────────────────────────────────────────────────
  const zone = req.nextUrl.searchParams.get("zone") as NasZone | null;
  const subPath = req.nextUrl.searchParams.get("path") ?? "";

  if (!zone || !(zone in NAS_ZONES)) {
    return NextResponse.json({ error: "Invalid zone" }, { status: 400 });
  }

  // ── 개인 zone access control ──────────────────────────────────────────────
  if (zone === "개인" && !isPrivileged) {
    // Look up this user's NAS folder name from their member record
    const memberId = session.user.memberId;
    if (!memberId) {
      return NextResponse.json(
        { error: "No member record linked to your account" },
        { status: 403 },
      );
    }

    const [member] = await db
      .select({ nasFolderName: members.nasFolderName })
      .from(members)
      .where(eq(members.id, memberId))
      .limit(1);

    const allowedFolder = member?.nasFolderName;
    if (!allowedFolder) {
      return NextResponse.json(
        { error: "NAS folder not configured for your account" },
        { status: 403 },
      );
    }

    // The sub-path must start with the member's own folder (or be empty → we force it)
    const normalised = subPath.replace(/^\/+/, "");
    if (normalised !== allowedFolder && !normalised.startsWith(allowedFolder + "/")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
  }

  // ── List ──────────────────────────────────────────────────────────────────
  try {
    const entries = await listDir(zone, subPath);
    return NextResponse.json({ entries, zone, path: subPath });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg.includes("ENOENT")) {
      return NextResponse.json({ error: "Directory not found" }, { status: 404 });
    }
    if (msg.includes("Invalid path")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
