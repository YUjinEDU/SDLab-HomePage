"use server";

import { createClient } from "@/lib/db/supabase-server";
import { revalidatePath } from "next/cache";

export async function updateContact(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contact_info")
    .update({
      lab_name_ko: formData.get("labNameKo") as string,
      lab_name_en: formData.get("labNameEn") as string,
      professor_name: formData.get("professorName") as string,
      professor_title: formData.get("professorTitle") as string,
      professor_email: formData.get("professorEmail") as string,
      building: formData.get("building") as string,
      professor_office: formData.get("professorOffice") as string,
      lab_room: formData.get("labRoom") as string,
      professor_phone: formData.get("professorPhone") as string,
      lab_phone: formData.get("labPhone") as string,
      department: formData.get("department") as string,
      university: formData.get("university") as string,
      address: formData.get("address") as string,
      map_embed_url: (formData.get("mapEmbedUrl") as string) || null,
    })
    .eq("id", "main");

  if (error) return { error: error.message };

  revalidatePath("/professor/contact");
  revalidatePath("/contact");
  return { success: true };
}
