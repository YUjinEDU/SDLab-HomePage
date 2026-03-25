import { redirect } from "next/navigation";
import { ProfessorSidebar } from "@/components/layout/ProfessorSidebar";
import { getSessionWithRole } from "@/lib/permissions";

export default async function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error } = await getSessionWithRole("professor");
  if (error || !user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ProfessorSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 xl:p-8 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
