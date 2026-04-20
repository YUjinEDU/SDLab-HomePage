import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/drizzle";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Member } from "@/types";
import { ProfileForm } from "./ProfileForm";

function toMember(row: typeof members.$inferSelect): Member {
  return {
    id: String(row.id),
    slug: row.slug,
    nameKo: row.nameKo,
    nameEn: row.nameEn ?? "",
    group: row.group as Member["group"],
    position: row.position ?? "",
    department: row.department ?? "",
    image: row.image ?? null,
    email: row.email ?? null,
    links: (row.links as Member["links"]) ?? {},
    researchKeywords: row.researchKeywords ?? [],
    bio: row.bio ?? null,
    education: (row.education as Member["education"]) ?? [],
    career: (row.career as Member["career"]) ?? [],
    displayOrder: row.displayOrder ?? 0,
  };
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Use memberId FK — reliable link between users and members tables
  const memberId = (session.user as { memberId?: number }).memberId;

  const rows = await db
    .select()
    .from(members)
    .where(eq(members.id, memberId ?? -1))
    .limit(1);

  const data = rows[0];

  if (!data) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">내 프로필</h1>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
          <p className="text-sm text-amber-800">
            멤버 정보가 연결되지 않았습니다. 관리자에게 문의하세요.
          </p>
        </div>
      </div>
    );
  }

  const member = toMember(data);

  return <ProfileForm member={member} />;
}
