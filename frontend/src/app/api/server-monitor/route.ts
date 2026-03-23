import { NextResponse } from "next/server";
import { getServerMonitorData } from "@/lib/queries/server-monitor";
import { getSession } from "@/actions/auth";
import { assertRole } from "@/lib/permissions";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roleError = await assertRole("member");
  if (roleError) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
