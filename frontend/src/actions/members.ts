"use server";

import { db } from "@/lib/db/drizzle";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { safeRevalidateTag } from "@/lib/utils/revalidate";
import { requireRole } from "@/lib/permissions";
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
  try { await requireRole("professor"); } catch { return { error: "권한이 없습니다." }; }

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
  const displayOrderParsed = parseInt((formData.get("displayOrder") as string) || "0", 10);
  const displayOrder = isNaN(displayOrderParsed) ? 0 : displayOrderParsed;
  const nasFolderName = ((formData.get("nasFolderName") as string) || "").trim() || null;

  const keywordsRaw = formData.get("researchKeywords") as string;
  const researchKeywords = keywordsRaw
    ? keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  const links = extractLinks(formData);
  const education = parseJsonField(formData.get("education") as string);
  const career = parseJsonField(formData.get("career") as string);

  const slug = generateSlug(nameEn);

  try {
    await db.insert(members).values({
      slug, nameKo, nameEn, group, position, department,
      email, image, bio, displayOrder, researchKeywords, links, education, career, nasFolderName,
    });
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("members");
  return { success: true };
}

export async function updateMember(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try { await requireRole("professor"); } catch { return { error: "권한이 없습니다." }; }

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

  const numId = parseInt(id, 10);
  if (isNaN(numId)) return { error: "Invalid member ID" };

  const email = (formData.get("email") as string) || null;
  const image = (formData.get("image") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  const displayOrderParsed = parseInt((formData.get("displayOrder") as string) || "0", 10);
  const displayOrder = isNaN(displayOrderParsed) ? 0 : displayOrderParsed;
  const nasFolderName = ((formData.get("nasFolderName") as string) || "").trim() || null;

  const keywordsRaw = formData.get("researchKeywords") as string;
  const researchKeywords = keywordsRaw
    ? keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  const links = extractLinks(formData);
  const education = parseJsonField(formData.get("education") as string);
  const career = parseJsonField(formData.get("career") as string);

  try {
    await db.update(members).set({
      nameKo, nameEn, group, position, department,
      email, image, bio, displayOrder, researchKeywords, links, education, career, nasFolderName,
    }).where(eq(members.id, numId));
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("members");
  return { success: true };
}

export async function deleteMember(id: string): Promise<ActionResult> {
  try { await requireRole("professor"); } catch { return { error: "권한이 없습니다." }; }

  const numId = parseInt(id, 10);
  if (isNaN(numId)) return { error: "Invalid member ID" };

  try {
    await db.delete(members).where(eq(members.id, numId));
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("members");
  return { success: true };
}
