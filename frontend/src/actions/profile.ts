"use server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/drizzle";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/action";

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

export async function updateMyProfile(
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "로그인 필요" };
  }

  const memberId = session.user.memberId;
  if (!memberId) {
    return { success: false, error: "연결된 프로필 정보가 없습니다." };
  }

  // Fetch slug for revalidation
  const [member] = await db
    .select({ id: members.id, slug: members.slug })
    .from(members)
    .where(eq(members.id, memberId))
    .limit(1);

  if (!member) {
    return { success: false, error: "연결된 멤버 정보가 없습니다." };
  }

  const email = (formData.get("email") as string)?.trim() || null;
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

  try {
    await db
      .update(members)
      .set({
        email,
        image,
        bio,
        researchKeywords,
        links,
        education,
        career,
      })
      .where(eq(members.id, member.id));
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  revalidatePath("/internal/profile");
  revalidatePath("/members");
  revalidatePath(`/members/${member.slug}`);
  return { success: true };
}
