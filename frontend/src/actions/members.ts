"use server";

import { createClient } from "@/lib/db/supabase-server";
import { revalidatePath } from "next/cache";
import { assertRole } from "@/lib/permissions";
import type { ActionResult } from "@/types/action";

function requireString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`);
  }
  return value.trim();
}

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

function generateSlug(nameEn: string): string {
  return nameEn
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createMember(formData: FormData): Promise<ActionResult> {
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();

  let nameKo: string;
  let nameEn: string;
  let group: string;
  let position: string;
  let department: string;
  try {
    nameKo = requireString(formData, "nameKo");
    nameEn = requireString(formData, "nameEn");
    group = requireString(formData, "group");
    position = requireString(formData, "position");
    department = requireString(formData, "department");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const email = (formData.get("email") as string) || null;
  const image = (formData.get("image") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  const displayOrder = parseInt(
    (formData.get("displayOrder") as string) || "0",
    10,
  );

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

  const slug = generateSlug(nameEn);
  const id = crypto.randomUUID();

  const { error } = await supabase.from("members").insert({
    id,
    slug,
    name_ko: nameKo,
    name_en: nameEn,
    group,
    position,
    department,
    email,
    image,
    bio,
    display_order: displayOrder,
    research_keywords: researchKeywords,
    links,
    education,
    career,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/professor/members");
  revalidatePath("/members");
  return { success: true };
}

export async function updateMember(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();

  let nameKo: string;
  let nameEn: string;
  let group: string;
  let position: string;
  let department: string;
  try {
    nameKo = requireString(formData, "nameKo");
    nameEn = requireString(formData, "nameEn");
    group = requireString(formData, "group");
    position = requireString(formData, "position");
    department = requireString(formData, "department");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const email = (formData.get("email") as string) || null;
  const image = (formData.get("image") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  const displayOrder = parseInt(
    (formData.get("displayOrder") as string) || "0",
    10,
  );

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
      name_ko: nameKo,
      name_en: nameEn,
      group,
      position,
      department,
      email,
      image,
      bio,
      display_order: displayOrder,
      research_keywords: researchKeywords,
      links,
      education,
      career,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/professor/members");
  revalidatePath("/members");
  return { success: true };
}

export async function deleteMember(id: string): Promise<ActionResult> {
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();

  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/professor/members");
  revalidatePath("/members");
  return { success: true };
}
