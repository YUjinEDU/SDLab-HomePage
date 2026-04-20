import "server-only";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { NAS_ZONES, mimeFor } from "@/lib/nas/fs";

type Props = { params: Promise<{ filename: string[] }> };

export async function GET(_req: NextRequest, { params }: Props): Promise<NextResponse> {
  const { filename } = await params;
  const joined = filename.join("/");

  // Prevent path traversal
  const profilesDir = path.join(NAS_ZONES["공용"], "profiles");
  const resolved = path.resolve(profilesDir, joined);
  if (!resolved.startsWith(profilesDir + path.sep) && resolved !== profilesDir) {
    return NextResponse.json({ error: "잘못된 경로입니다." }, { status: 400 });
  }

  let arrayBuffer: ArrayBuffer;
  try {
    const data = await fs.readFile(resolved);
    arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
  } catch {
    return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
  }

  const ext = path.extname(resolved).slice(1).toLowerCase();
  const contentType = mimeFor(ext);

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
