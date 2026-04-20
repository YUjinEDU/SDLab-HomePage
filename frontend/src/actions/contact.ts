"use server";

import { db } from "@/lib/db/drizzle";
import { contactInfo } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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

export async function updateContact(formData: FormData): Promise<ActionResult> {
  try { await requireRole("professor"); } catch { return { error: "권한이 없습니다." }; }

  let labNameKo: string;
  let labNameEn: string;
  let professorName: string;
  let professorEmail: string;
  let building: string;
  let department: string;
  let university: string;
  let address: string;
  try {
    labNameKo = requireString(formData, "labNameKo");
    labNameEn = requireString(formData, "labNameEn");
    professorName = requireString(formData, "professorName");
    professorEmail = requireString(formData, "professorEmail");
    building = requireString(formData, "building");
    department = requireString(formData, "department");
    university = requireString(formData, "university");
    address = requireString(formData, "address");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const professorPhone =
    ((formData.get("professorPhone") as string) || "").trim() || null;

  try {
    await db
      .update(contactInfo)
      .set({
        labNameKo,
        labNameEn,
        professorName,
        professorEmail,
        building,
        professorPhone,
        department,
        university,
        address,
        mapEmbedUrl: (formData.get("mapEmbedUrl") as string) || null,
      })
      .where(eq(contactInfo.id, 1));
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("contact");
  revalidatePath("/professor/contact");
  revalidatePath("/contact");
  return { success: true };
}
