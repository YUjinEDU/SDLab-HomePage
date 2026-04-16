import { db } from "@/lib/db/drizzle";
import { contactInfo } from "@/lib/db/schema";
import type { ContactInfo } from "@/types";

export async function getContactInfo(): Promise<ContactInfo> {
  const [row] = await db.select().from(contactInfo).limit(1);

  if (!row) throw new Error("Contact info not found");

  return {
    labName: {
      ko: row.labNameKo ?? "",
      en: row.labNameEn ?? "",
    },
    professor: {
      name: row.professorName ?? "",
      title: "",
      email: row.professorEmail ?? "",
    },
    location: {
      building: row.building ?? "",
      professorOffice: "",
      lab: "",
      professorPhone: row.professorPhone ?? "",
      labPhone: "",
    },
    department: row.department ?? "",
    university: row.university ?? "",
    address: row.address ?? "",
    mapEmbedUrl: row.mapEmbedUrl ?? null,
  };
}
