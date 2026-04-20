import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { NAS_ZONES } from "@/lib/nas/fs";
import path from "path";
import fsPromises from "fs/promises";

type AppSession = {
  user: { role?: string; nasFolderName?: string; memberId?: number };
} | null;

export async function POST(req: NextRequest) {
  const session = (await auth()) as AppSession;
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: { zone: string; path: string; newName: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { zone, path: subpath, newName } = body;

  if (zone !== "공용" && zone !== "개인") {
    return NextResponse.json({ error: "잘못된 zone입니다." }, { status: 400 });
  }

  // Sanitize new name — strip any directory components
  const safeName = path.basename(newName?.trim() ?? "");
  if (!safeName || safeName === "." || safeName === "..") {
    return NextResponse.json({ error: "잘못된 이름입니다." }, { status: 400 });
  }

  const role = session.user.role;
  const nasFolderName = session.user.nasFolderName;
  const isPrivileged = role === "professor" || role === "admin";

  if (zone === "공용" && !isPrivileged) {
    return NextResponse.json({ error: "공용 폴더는 교수/관리자만 수정할 수 있습니다." }, { status: 403 });
  }

  if (zone === "개인" && !isPrivileged) {
    if (!nasFolderName) {
      return NextResponse.json({ error: "NAS 개인 폴더가 할당되지 않았습니다." }, { status: 403 });
    }
    const normalized = subpath.replace(/\\/g, "/").replace(/^\/+/, "");
    const isOwnFolder = normalized === nasFolderName || normalized.startsWith(nasFolderName + "/");
    if (!isOwnFolder) {
      return NextResponse.json({ error: "본인 폴더만 수정할 수 있습니다." }, { status: 403 });
    }
  }

  // ── Path safety ────────────────────────────────────────────────────────────
  const root = path.resolve(NAS_ZONES[zone]);
  const target = path.resolve(root, subpath);
  if (target !== root && !target.startsWith(root + path.sep)) {
    return NextResponse.json({ error: "잘못된 경로입니다." }, { status: 400 });
  }
  if (target === root) {
    return NextResponse.json({ error: "루트 폴더는 이름을 바꿀 수 없습니다." }, { status: 400 });
  }

  const newTarget = path.join(path.dirname(target), safeName);
  // Ensure renamed target stays inside zone root
  if (!newTarget.startsWith(root + path.sep)) {
    return NextResponse.json({ error: "잘못된 경로입니다." }, { status: 400 });
  }

  try {
    await fsPromises.rename(target, newTarget);
  } catch (e) {
    console.error("[rename] error:", e);
    return NextResponse.json({ error: "이름 변경에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true, name: safeName });
}
