import { NextResponse } from "next/server";
import { getServerMonitorData } from "@/lib/queries/server-monitor";
import { auth } from "@/lib/auth/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getServerMonitorData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch server data" },
      { status: 500 },
    );
  }
}
