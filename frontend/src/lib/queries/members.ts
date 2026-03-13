import { createClient } from "@/lib/db/supabase-server";
import type { Member } from "@/types";

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

export async function getMembers(): Promise<Member[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("display_order");

  if (error) throw error;
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

  if (error) throw error;
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

  if (error) throw error;
  return (data ?? []).map(toMember);
}
