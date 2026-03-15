import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/db/supabase-server";
import { createStaticClient } from "@/lib/db/supabase-static";
import type { Publication } from "@/types";

type PubRow = Record<string, unknown> & {
  publication_authors?: { member_id: string; author_order: number }[];
  publication_research_areas?: { research_area_id: string }[];
  publication_projects?: { project_id: string }[];
};

function toPublication(row: PubRow): Publication {
  const authorMemberIds = (row.publication_authors ?? [])
    .sort((a, b) => a.author_order - b.author_order)
    .map((a) => a.member_id);

  const researchAreaIds = (row.publication_research_areas ?? []).map(
    (r) => r.research_area_id,
  );

  const projectIds = (row.publication_projects ?? []).map((p) => p.project_id);

  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    authors: (row.authors as string[]) ?? [],
    authorMemberIds,
    type: row.type as Publication["type"],
    isInternational: (row.is_international as boolean) ?? true,
    venue: row.venue as string,
    year: row.year as number,
    month: (row.month as number) ?? null,
    doi: (row.doi as string) ?? null,
    pdfUrl: (row.pdf_url as string) ?? null,
    abstract: (row.abstract as string) ?? null,
    keywords: (row.keywords as string[]) ?? [],
    bibtex: (row.bibtex as string) ?? null,
    researchAreaIds,
    projectIds,
    isFeatured: (row.is_featured as boolean) ?? false,
  };
}

const PUB_SELECT = `
  *,
  publication_authors(member_id, author_order),
  publication_research_areas(research_area_id),
  publication_projects(project_id)
`;

export const getPublications = unstable_cache(
  async (): Promise<Publication[]> => {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("publications")
      .select(PUB_SELECT)
      .eq("is_public", true)
      .neq("type", "patent")
      .order("year", { ascending: false })
      .order("month", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toPublication);
  },
  ["publications-public"],
  { tags: ["publications"] },
);

export const getPublicationBySlug = unstable_cache(
  async (slug: string): Promise<Publication | null> => {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("publications")
      .select(PUB_SELECT)
      .eq("is_public", true)
      .eq("slug", slug)
      .single();

    if (error) return null;
    return toPublication(data);
  },
  ["publication-slug"],
  { tags: ["publications"] },
);

export const getFeaturedPublications = unstable_cache(
  async (): Promise<Publication[]> => {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("publications")
      .select(PUB_SELECT)
      .eq("is_public", true)
      .eq("is_featured", true)
      .neq("type", "patent")
      .order("year", { ascending: false })
      .limit(3);

    if (error) throw error;
    return (data ?? []).map(toPublication);
  },
  ["publications-featured"],
  { tags: ["publications"] },
);

export const getPatents = unstable_cache(
  async (): Promise<Publication[]> => {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("publications")
      .select(PUB_SELECT)
      .eq("is_public", true)
      .eq("type", "patent")
      .order("year", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toPublication);
  },
  ["patents-public"],
  { tags: ["publications"] },
);

export const getPatentBySlug = unstable_cache(
  async (slug: string): Promise<Publication | null> => {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("publications")
      .select(PUB_SELECT)
      .eq("is_public", true)
      .eq("slug", slug)
      .eq("type", "patent")
      .single();

    if (error) return null;
    return toPublication(data);
  },
  ["patent-slug"],
  { tags: ["publications"] },
);

export const getProjectOutputs = (projectId: string) =>
  unstable_cache(
    async (): Promise<Publication[]> => {
      const supabase = createStaticClient();
      const { data: joinRows } = await supabase
        .from("publication_projects")
        .select("publication_id")
        .eq("project_id", projectId);

      if (!joinRows?.length) return [];

      const pubIds = joinRows.map((r) => r.publication_id);
      const { data, error } = await supabase
        .from("publications")
        .select(PUB_SELECT)
        .eq("is_public", true)
        .in("id", pubIds)
        .order("year", { ascending: false });

      if (error) throw error;
      return (data ?? []).map(toPublication);
    },
    ["project-outputs", projectId],
    { tags: ["projects", "publications"] },
  )();

export async function getAllPublications(): Promise<Publication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select(PUB_SELECT)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toPublication);
}

export async function getPublicationById(
  id: string,
): Promise<Publication | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select(PUB_SELECT)
    .eq("id", id)
    .single();

  if (error) return null;
  return toPublication(data);
}

export async function getPublicationsByMember(
  memberId: string,
): Promise<Publication[]> {
  const supabase = createStaticClient();
  const { data: authorRows } = await supabase
    .from("publication_authors")
    .select("publication_id")
    .eq("member_id", memberId);

  if (!authorRows?.length) return [];

  const pubIds = authorRows.map((r) => r.publication_id);
  const { data, error } = await supabase
    .from("publications")
    .select(PUB_SELECT)
    .eq("is_public", true)
    .in("id", pubIds)
    .order("year", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toPublication);
}
