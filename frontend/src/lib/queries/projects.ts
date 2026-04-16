import { unstable_cache } from "next/cache";
import { db } from "@/lib/db/drizzle";
import {
  projects,
  projectMembers,
  projectResearchAreas,
  publicationProjects,
} from "@/lib/db/schema";
import { eq, desc, inArray, and, isNotNull } from "drizzle-orm";
import type { Project } from "@/types";

type ProjRow = typeof projects.$inferSelect;

async function enrichProject(row: ProjRow): Promise<Project> {
  const [memberRows, researchAreaRows, publicationRows] = await Promise.all([
    db
      .select({ memberId: projectMembers.memberId })
      .from(projectMembers)
      .where(eq(projectMembers.projectId, row.id)),
    db
      .select({ researchAreaId: projectResearchAreas.researchAreaId })
      .from(projectResearchAreas)
      .where(eq(projectResearchAreas.projectId, row.id)),
    db
      .select({ publicationId: publicationProjects.publicationId })
      .from(publicationProjects)
      .where(eq(publicationProjects.projectId, row.id)),
  ]);

  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    status: row.status as Project["status"],
    category: row.category ?? "",
    shortDescription: row.shortDescription ?? "",
    fullDescription: row.fullDescription ?? null,
    organization: row.organization ?? "",
    programType: row.programType ?? null,
    budget: row.budget != null ? String(row.budget) : null,
    startDate: row.startDate ? row.startDate.toISOString() : "",
    endDate: row.endDate ? row.endDate.toISOString() : null,
    thumbnail: row.thumbnail ?? null,
    tags: row.tags ?? [],
    memberIds: memberRows.map((m) => String(m.memberId)),
    publicationIds: publicationRows.map((p) => String(p.publicationId)),
    researchAreaIds: researchAreaRows.map((r) => String(r.researchAreaId)),
    demoUrl: row.demoUrl ?? null,
    isFeatured: row.isFeatured ?? false,
    isPublic: row.isPublic ?? false,
  };
}

export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.isPublic, true))
      .orderBy(desc(projects.startDate));
    return Promise.all(rows.map(enrichProject));
  },
  ["projects-public"],
  { tags: ["projects"] },
);

export const getProjectBySlug = unstable_cache(
  async (slug: string): Promise<Project | null> => {
    const [row] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.isPublic, true), eq(projects.slug, slug)))
      .limit(1);
    return row ? enrichProject(row) : null;
  },
  ["project-slug"],
  { tags: ["projects"] },
);

export const getFeaturedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await db
      .select()
      .from(projects)
      .where(and(eq(projects.isPublic, true), eq(projects.isFeatured, true)))
      .orderBy(desc(projects.startDate))
      .limit(3);
    return Promise.all(rows.map(enrichProject));
  },
  ["projects-featured"],
  { tags: ["projects"] },
);

export const getActiveProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await db
      .select()
      .from(projects)
      .where(and(eq(projects.isPublic, true), eq(projects.status, "active")))
      .orderBy(desc(projects.startDate));
    return Promise.all(rows.map(enrichProject));
  },
  ["projects-active"],
  { tags: ["projects"] },
);

export const getDemoProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await db
      .select()
      .from(projects)
      .where(and(eq(projects.isPublic, true), isNotNull(projects.demoUrl)))
      .orderBy(desc(projects.isFeatured));
    return Promise.all(rows.map(enrichProject));
  },
  ["projects-demos"],
  { tags: ["projects"] },
);

export async function getProjectById(id: string): Promise<Project | null> {
  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, Number(id)))
    .limit(1);
  return row ? enrichProject(row) : null;
}

export const getAllProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.startDate));
    return Promise.all(rows.map(enrichProject));
  },
  ["all-projects"],
  { tags: ["projects"] },
);

export async function getProjectsByMember(memberId: string): Promise<Project[]> {
  const memberRows = await db
    .select({ projectId: projectMembers.projectId })
    .from(projectMembers)
    .where(eq(projectMembers.memberId, Number(memberId)));

  if (!memberRows.length) return [];

  const projIds = memberRows.map((r) => r.projectId);
  const rows = await db
    .select()
    .from(projects)
    .where(and(eq(projects.isPublic, true), inArray(projects.id, projIds)))
    .orderBy(desc(projects.startDate));
  return Promise.all(rows.map(enrichProject));
}
