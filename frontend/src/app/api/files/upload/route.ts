import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { NAS_ZONES } from "@/lib/nas/fs";
import path from "path";
import fsPromises from "fs/promises";

type AppSession = {
  user: {
    role?: string;
    nasFolderName?: string;
    memberId?: number;
  };
} | null;

export async function POST(req: NextRequest) {
  const session = (await auth()) as AppSession;
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const zone = formData.get("zone") as string;
  const subpath = (formData.get("subpath") as string) || "";
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  if (zone !== "공용" && zone !== "개인") {
    return NextResponse.json({ error: "잘못된 zone입니다." }, { status: 400 });
  }

  const role = session.user.role;
  const nasFolderName = session.user.nasFolderName;
  const isPrivileged = role === "professor" || role === "admin";

  // ── Permission checks ──────────────────────────────────────────────────────
  if (zone === "공용" && !isPrivileged) {
    return NextResponse.json(
      { error: "공용 폴더는 교수/관리자만 업로드할 수 있습니다." },
      { status: 403 },
    );
  }

  if (zone === "개인" && !isPrivileged) {
    if (!nasFolderName) {
      return NextResponse.json(
        { error: "NAS 개인 폴더가 할당되지 않았습니다. 관리자에게 문의하세요." },
        { status: 403 },
      );
    }
    // Regular members can only upload inside their own folder
    const normalizedSubpath = subpath.replace(/\\/g, "/").replace(/^\/+/, "");
    const isOwnFolder =
      normalizedSubpath === nasFolderName ||
      normalizedSubpath.startsWith(nasFolderName + "/");
    if (!isOwnFolder) {
      return NextResponse.json(
        { error: "본인 폴더에만 업로드할 수 있습니다." },
        { status: 403 },
      );
    }
  }

  // ── Path safety ────────────────────────────────────────────────────────────
  const root = path.resolve(NAS_ZONES[zone]);
  const targetDir = path.resolve(root, subpath);
  if (targetDir !== root && !targetDir.startsWith(root + path.sep)) {
    return NextResponse.json({ error: "잘못된 경로입니다." }, { status: 400 });
  }

  // ── Filename sanitization ──────────────────────────────────────────────────
  // path.basename strips any directory components (prevents path traversal via filename)
  const filename = path.basename(file.name).trim();
  if (!filename || filename === "." || filename === "..") {
    return NextResponse.json({ error: "잘못된 파일명입니다." }, { status: 400 });
  }

  const targetPath = path.join(targetDir, filename);

  // ── Write file ─────────────────────────────────────────────────────────────
  try {
    await fsPromises.mkdir(targetDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fsPromises.writeFile(targetPath, buffer);
  } catch (e) {
    console.error("[upload] write error:", e);
    return NextResponse.json({ error: "파일 저장에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true, filename });
}
