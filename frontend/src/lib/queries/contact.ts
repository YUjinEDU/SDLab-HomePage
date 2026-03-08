import { createClient } from "@/lib/db/supabase-server";
import type { ContactInfo } from "@/types";

export async function getContactInfo(): Promise<ContactInfo> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_info")
    .select("*")
    .eq("id", "main")
    .single();

  if (error) throw error;

  return {
    labName: {
      ko: data.lab_name_ko,
      en: data.lab_name_en,
    },
    professor: {
      name: data.professor_name,
      title: data.professor_title,
      email: data.professor_email,
    },
    location: {
      building: data.building,
      professorOffice: data.professor_office,
      lab: data.lab_room,
      professorPhone: data.professor_phone,
      labPhone: data.lab_phone,
    },
    department: data.department,
    university: data.university,
    address: data.address,
    mapEmbedUrl: data.map_embed_url ?? null,
  };
}
