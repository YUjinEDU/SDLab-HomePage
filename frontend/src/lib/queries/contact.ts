import { unstable_cache } from "next/cache";
import { db } from "@/lib/db/drizzle";
import { contactInfo } from "@/lib/db/schema";
import type { ContactInfo } from "@/types";

export const getContactInfo = unstable_cache(
  async (): Promise<ContactInfo | null> => {
    const [row] = await db.select().from(contactInfo).limit(1);

    if (!row) return null;

    return {
      labName: {
        ko: row.labNameKo ?? "",
        en: row.labNameEn ?? "",
      },
      professor: {
        name: row.professorName ?? "",
        title: row.professorTitle ?? "",
        email: row.professorEmail ?? "",
      },
      location: {
        building: row.building ?? "",
        professorOffice: row.professorOffice ?? "",
        lab: row.labRoom ?? "",
        professorPhone: row.professorPhone ?? "",
        labPhone: row.labPhone ?? "",
      },
      department: row.department ?? "",
      university: row.university ?? "",
      address: row.address ?? "",
      mapEmbedUrl: row.mapEmbedUrl ?? null,
    };
  },
  ["contact-info"],
  { tags: ["contact"] },
);
