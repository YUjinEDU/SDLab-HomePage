import { redirect } from "next/navigation";

export default function GpuMonitorPage() {
  redirect("/internal/server-monitor");
}
