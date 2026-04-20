import "server-only";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { auth } from "@/lib/auth/auth";
import { NAS_ZONES } from "@/lib/nas/fs";

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "요청을 파싱할 수 없습니다." }, { status: 400 });
  }

  const file = formData.get("file");
  const memberId = (formData.get("memberId") as string) ?? "unknown";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 });
  }

  const ext = path.extname(file.name).slice(1).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: "jpg, jpeg, png, webp, gif 형식만 업로드할 수 있습니다." },
      { status: 400 },
    );
  }

  const timestamp = Date.now();
  const filename = `${memberId}-${timestamp}.${ext}`;
  const profilesDir = path.join(NAS_ZONES["공용"], "profiles");

  try {
    await fs.mkdir(profilesDir, { recursive: true });
    const dest = path.join(profilesDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(dest, buffer);
  } catch (e) {
    console.error("[profile-photo upload]", e);
    return NextResponse.json({ error: "파일 저장에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ url: `/api/public/profiles/${filename}` });
}
