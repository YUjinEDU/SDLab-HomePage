import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { readdir, stat } from "fs/promises";
import { join } from "path";

const SHARED_DIR = "/nas/공용/게시판";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await import("fs/promises").then(fs => fs.mkdir(SHARED_DIR, { recursive: true }));
    const entries = await readdir(SHARED_DIR, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter(e => e.isFile())
        .map(async (e) => {
          const info = await stat(join(SHARED_DIR, e.name));
          return {
            name: e.name,
            path: `/nas/공용/게시판/${e.name}`,
            size: info.size,
            modifiedAt: info.mtime.toISOString(),
          };
        })
    );
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [] });
  }
}
