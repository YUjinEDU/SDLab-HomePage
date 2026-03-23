import { createClient } from "@/lib/db/supabase-server";
import type { Member } from "@/types";

type MemberRow = {
  id: string;
  slug: string;
  name_ko: string;
  name_en: string;
  group: Member["group"];
  position: string;
  department: string;
  image: string | null;
  email: string | null;
  links: Member["links"] | null;
  research_keywords: string[] | null;
  bio: string | null;
  education: Member["education"] | null;
  career: Member["career"] | null;
  display_order: number;
};

function toMember(row: MemberRow): Member {
  return {
    id: row.id,
    slug: row.slug,
    nameKo: row.name_ko,
    nameEn: row.name_en,
    group: row.group,
    position: row.position,
    department: row.department,
    image: row.image ?? null,
    email: row.email ?? null,
    links: row.links ?? {},
    researchKeywords: row.research_keywords ?? [],
    bio: row.bio ?? null,
    education: row.education ?? [],
    career: row.career ?? [],
    displayOrder: row.display_order,
  };
}

export async function getMembers(): Promise<Member[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("display_order");

  if (error) return [];
  return (data ?? []).map(toMember);
}

export async function getMemberBySlug(slug: string): Promise<Member | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return toMember(data);
}

export async function getMemberById(id: string): Promise<Member | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return toMember(data);
}

export async function getProfessor(): Promise<Member | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("group", "professor")
    .order("display_order")
    .limit(1)
    .single();

  if (error) return null;
  return toMember(data);
}

export async function getAlumniCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("group", "alumni");

  if (error) return 0;
  return count ?? 0;
}

export async function getMemberStubs(): Promise<
  Pick<Member, "id" | "nameKo" | "nameEn" | "slug">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("id, name_ko, name_en, slug")
    .order("display_order");

  if (error) return [];
  return (data ?? []).map((r) => ({
    id: r.id as string,
    nameKo: r.name_ko as string,
    nameEn: r.name_en as string,
    slug: r.slug as string,
  }));
}

export async function getStudents(): Promise<Member[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .neq("group", "professor")
    .order("display_order");

  if (error) return [];
  return (data ?? []).map(toMember);
}
