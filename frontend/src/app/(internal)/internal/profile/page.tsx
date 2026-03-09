import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { createClient } from "@/lib/db/supabase-server";
import type { Member } from "@/types";
import { ProfileForm } from "./ProfileForm";

function toMember(row: Record<string, unknown>): Member {
  return {
    id: row.id as string,
    slug: row.slug as string,
    nameKo: row.name_ko as string,
    nameEn: row.name_en as string,
    group: row.group as Member["group"],
    position: row.position as string,
    department: row.department as string,
    image: (row.image as string) ?? null,
    email: (row.email as string) ?? null,
    links: (row.links as Member["links"]) ?? {},
    researchKeywords: (row.research_keywords as string[]) ?? [],
    bio: (row.bio as string) ?? null,
    education: (row.education as Member["education"]) ?? [],
    career: (row.career as Member["career"]) ?? [],
    displayOrder: row.display_order as number,
  };
}

export default async function ProfilePage() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("email", user.email!)
    .single();

  if (error || !data) {
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
