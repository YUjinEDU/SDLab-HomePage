"use server";

import { createClient } from "@/lib/db/supabase-server";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";

function extractLinks(formData: FormData) {
  const links: Record<string, string> = {};
  const linkFields = [
    "github",
    "scholar",
    "homepage",
    "orcid",
    "dblp",
  ] as const;
  for (const field of linkFields) {
    const value = formData.get(field) as string | null;
    if (value?.trim()) {
      links[field] = value.trim();
    }
  }
  return links;
}

function parseJsonField(value: string | null): unknown[] {
  if (!value?.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function updateMyProfile(formData: FormData) {
  const user = await getSession();
  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const supabase = await createClient();

  // Find the member record matching user's email
  const { data: member, error: fetchError } = await supabase
    .from("members")
    .select("id, slug")
    .eq("email", user.email!)
    .single();

  if (fetchError || !member) {
    return { error: "연결된 멤버 정보가 없습니다." };
  }

  const image = (formData.get("image") as string) || null;
  const bio = (formData.get("bio") as string) || null;

  const keywordsRaw = formData.get("researchKeywords") as string;
  const researchKeywords = keywordsRaw
    ? keywordsRaw
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : [];

  const links = extractLinks(formData);
  const education = parseJsonField(formData.get("education") as string);
  const career = parseJsonField(formData.get("career") as string);

  const { error } = await supabase
    .from("members")
    .update({
      image,
      bio,
      research_keywords: researchKeywords,
      links,
      education,
      career,
    })
    .eq("id", member.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/internal/profile");
  revalidatePath("/members");
  revalidatePath(`/members/${member.slug}`);
  return { success: true };
}
