import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/drizzle";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { FileBrowser } from "@/components/files/FileBrowser";

export const metadata = { title: "파일 관리" };

export default async function FilesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role as string;
  const isPrivileged = ["professor", "admin"].includes(role);

  // Look up the member's NAS folder name
  let memberFolder: string | undefined;
  const memberId = (session.user as { memberId?: number }).memberId;

  if (memberId) {
    const [member] = await db
      .select({ nasFolderName: members.nasFolderName })
      .from(members)
      .where(eq(members.id, memberId))
      .limit(1);
    memberFolder = member?.nasFolderName ?? undefined;
  }

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">파일 관리</h1>
        <p className="text-sm text-gray-500 mt-1">
          공용 폴더는 모든 멤버가 접근할 수 있습니다.
          개인 폴더는 본인 폴더에만 접근 가능합니다.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <FileBrowser
          defaultZone="공용"
          memberFolder={memberFolder}
          isPrivileged={isPrivileged}
        />
      </div>
    </div>
  );
}
