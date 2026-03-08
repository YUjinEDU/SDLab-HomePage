import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";
import { InternalSidebar } from "@/components/layout/InternalSidebar";

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <InternalSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 min-w-0 p-6 lg:p-8 lg:ml-64">{children}</main>
    </div>
  );
}
