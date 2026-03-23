import { createClient } from "@/lib/db/supabase-server";
import type { ResearchArea } from "@/types";

type ResearchAreaRow = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  icon: string;
  image: string | null;
  keywords: string[] | null;
  applications: string[] | null;
  display_order: number;
};

function toResearchArea(row: ResearchAreaRow): ResearchArea {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    icon: row.icon,
    image: row.image ?? null,
    keywords: row.keywords ?? [],
    applications: row.applications ?? [],
    displayOrder: row.display_order,
  };
}

export async function getResearchAreas(): Promise<ResearchArea[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("research_areas")
    .select("*")
    .order("display_order");

  if (error) return [];
  return (data ?? []).map(toResearchArea);
}
