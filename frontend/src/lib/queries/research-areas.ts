import { unstable_cache } from "next/cache";
import { db } from "@/lib/db/drizzle";
import { researchAreas } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import type { ResearchArea } from "@/types";

type ResearchAreaRow = typeof researchAreas.$inferSelect;

function toResearchArea(row: ResearchAreaRow): ResearchArea {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription ?? "",
    fullDescription: row.fullDescription ?? "",
    icon: row.icon ?? "",
    image: row.image ?? null,
    keywords: row.keywords ?? [],
    applications: row.applications ?? [],
    displayOrder: row.displayOrder ?? 0,
  };
}

export const getResearchAreas = unstable_cache(
  async (): Promise<ResearchArea[]> => {
    const rows = await db
      .select()
      .from(researchAreas)
      .orderBy(asc(researchAreas.displayOrder));
    return rows.map(toResearchArea);
  },
  ["research-areas"],
  { tags: ["research-areas"] },
);
