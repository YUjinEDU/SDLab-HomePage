import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = "/nas/공용/게시판";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "";
  const uniqueName = `${randomUUID()}${ext ? "." + ext : ""}`;
  const savePath = join(UPLOAD_DIR, uniqueName);

  await mkdir(UPLOAD_DIR, { recursive: true });
  const bytes = await file.arrayBuffer();
  await writeFile(savePath, Buffer.from(bytes));

  return NextResponse.json({
    fileName: file.name,
    filePath: `/nas/공용/게시판/${uniqueName}`,
    fileSize: file.size,
    mimeType: file.type,
  });
}
