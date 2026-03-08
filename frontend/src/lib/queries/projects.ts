import { createClient } from "@/lib/db/supabase-server";
import type { Project } from "@/types";

type ProjRow = Record<string, unknown> & {
  project_members?: { member_id: string }[];
  project_research_areas?: { research_area_id: string }[];
  publication_projects?: { publication_id: string }[];
};

const PROJ_SELECT = `
  *,
  project_members(member_id),
  project_research_areas(research_area_id),
  publication_projects(publication_id)
`;

function toProject(row: ProjRow): Project {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    status: row.status as Project["status"],
    category: row.category as string,
    shortDescription: row.short_description as string,
    fullDescription: (row.full_description as string) ?? null,
    organization: row.organization as string,
    programType: (row.program_type as string) ?? null,
    budget: (row.budget as string) ?? null,
    startDate: row.start_date as string,
    endDate: (row.end_date as string) ?? null,
    thumbnail: (row.thumbnail as string) ?? null,
    tags: (row.tags as string[]) ?? [],
    memberIds: (row.project_members ?? []).map((m) => m.member_id),
    publicationIds: (row.publication_projects ?? []).map(
      (p) => p.publication_id,
    ),
    researchAreaIds: (row.project_research_areas ?? []).map(
      (r) => r.research_area_id,
    ),
    demoUrl: (row.demo_url as string) ?? null,
    isFeatured: (row.is_featured as boolean) ?? false,
  };
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJ_SELECT)
    .order("start_date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJ_SELECT)
    .eq("slug", slug)
    .single();

  if (error) return null;
  return toProject(data);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJ_SELECT)
    .eq("is_featured", true)
    .order("start_date", { ascending: false })
    .limit(3);

  if (error) throw error;
  return (data ?? []).map(toProject);
}

export async function getActiveProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJ_SELECT)
    .eq("status", "active")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJ_SELECT)
    .eq("id", id)
    .single();

  if (error) return null;
  return toProject(data);
}

export async function getDemoProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJ_SELECT)
    .not("demo_url", "is", null)
    .order("is_featured", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toProject);
}

export async function getProjectsByMember(
  memberId: string,
): Promise<Project[]> {
  const supabase = await createClient();
  const { data: memberRows } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("member_id", memberId);

  if (!memberRows?.length) return [];

  const projIds = memberRows.map((r) => r.project_id);
  const { data, error } = await supabase
    .from("projects")
    .select(PROJ_SELECT)
    .in("id", projIds)
    .order("start_date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toProject);
}
