import { NextResponse } from "next/server";
import { getServerMonitorData } from "@/lib/queries/server-monitor";
import { getSessionWithRole } from "@/lib/permissions";

export async function GET() {
  const { error } = await getSessionWithRole("member");
  if (error) {
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
