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

export async function updateContact(formData: FormData): Promise<ActionResult> {
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();

  let labNameKo: string;
  let labNameEn: string;
  let professorName: string;
  let professorTitle: string;
  let professorEmail: string;
  let building: string;
  let professorOffice: string;
  let labRoom: string;
  let department: string;
  let university: string;
  let address: string;
  try {
    labNameKo = requireString(formData, "labNameKo");
    labNameEn = requireString(formData, "labNameEn");
    professorName = requireString(formData, "professorName");
    professorTitle = requireString(formData, "professorTitle");
    professorEmail = requireString(formData, "professorEmail");
    building = requireString(formData, "building");
    professorOffice = requireString(formData, "professorOffice");
    labRoom = requireString(formData, "labRoom");
    department = requireString(formData, "department");
    university = requireString(formData, "university");
    address = requireString(formData, "address");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const professorPhone =
    ((formData.get("professorPhone") as string) || "").trim() || null;
  const labPhone = ((formData.get("labPhone") as string) || "").trim() || null;

  const { error } = await supabase
    .from("contact_info")
    .update({
      lab_name_ko: labNameKo,
      lab_name_en: labNameEn,
      professor_name: professorName,
      professor_title: professorTitle,
      professor_email: professorEmail,
      building,
      professor_office: professorOffice,
      lab_room: labRoom,
      professor_phone: professorPhone,
      lab_phone: labPhone,
      department,
      university,
      address,
      map_embed_url: (formData.get("mapEmbedUrl") as string) || null,
    })
    .eq("id", "main");

  if (error) return { error: error.message };

  revalidatePath("/professor/contact");
  revalidatePath("/contact");
  return { success: true };
}
