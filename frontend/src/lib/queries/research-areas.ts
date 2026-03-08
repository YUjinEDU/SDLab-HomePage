import { createClient } from "@/lib/db/supabase-server";
import type { ResearchArea } from "@/types";

function toResearchArea(row: Record<string, unknown>): ResearchArea {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    shortDescription: row.short_description as string,
    fullDescription: row.full_description as string,
    icon: row.icon as string,
    image: (row.image as string) ?? null,
    keywords: (row.keywords as string[]) ?? [],
    applications: (row.applications as string[]) ?? [],
    displayOrder: row.display_order as number,
  };
}

export async function getResearchAreas(): Promise<ResearchArea[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("research_areas")
    .select("*")
    .order("display_order");

  if (error) throw error;
  return (data ?? []).map(toResearchArea);
}
