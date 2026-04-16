import { redirect } from "next/navigation";
import { InternalSidebar } from "@/components/layout/InternalSidebar";
import { auth } from "@/lib/auth/auth";

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <InternalSidebar userEmail={session.user?.email ?? ""} />
      <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 xl:p-8 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
