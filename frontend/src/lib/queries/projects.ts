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

function toProject(
  row: ProjRow,
  memberIds: string[],
  researchAreaIds: string[],
  publicationIds: string[],
): Project {
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
    memberIds,
    publicationIds,
    researchAreaIds,
    demoUrl: row.demoUrl ?? null,
    isFeatured: row.isFeatured ?? false,
    isPublic: row.isPublic ?? false,
  };
}

/** Batch-fetches all join-table rows in 3 queries regardless of list size (avoids N+1). */
async function bulkEnrichProjects(rows: ProjRow[]): Promise<Project[]> {
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);

  const [memberRows, researchAreaRows, publicationRows] = await Promise.all([
    db
      .select({ projectId: projectMembers.projectId, memberId: projectMembers.memberId })
      .from(projectMembers)
      .where(inArray(projectMembers.projectId, ids)),
    db
      .select({
        projectId: projectResearchAreas.projectId,
        researchAreaId: projectResearchAreas.researchAreaId,
      })
      .from(projectResearchAreas)
      .where(inArray(projectResearchAreas.projectId, ids)),
    db
      .select({
        projectId: publicationProjects.projectId,
        publicationId: publicationProjects.publicationId,
      })
      .from(publicationProjects)
      .where(inArray(publicationProjects.projectId, ids)),
  ]);

  const memberMap = new Map<number, string[]>();
  for (const r of memberRows) {
    const arr = memberMap.get(r.projectId) ?? [];
    arr.push(String(r.memberId));
    memberMap.set(r.projectId, arr);
  }

  const areaMap = new Map<number, string[]>();
  for (const r of researchAreaRows) {
    const arr = areaMap.get(r.projectId) ?? [];
    arr.push(String(r.researchAreaId));
    areaMap.set(r.projectId, arr);
  }

  const pubMap = new Map<number, string[]>();
  for (const r of publicationRows) {
    const arr = pubMap.get(r.projectId) ?? [];
    arr.push(String(r.publicationId));
    pubMap.set(r.projectId, arr);
  }

  return rows.map((row) =>
    toProject(
      row,
      memberMap.get(row.id) ?? [],
      areaMap.get(row.id) ?? [],
      pubMap.get(row.id) ?? [],
    ),
  );
}

async function enrichProject(row: ProjRow): Promise<Project> {
  const [result] = await bulkEnrichProjects([row]);
  return result;
}

export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.isPublic, true))
      .orderBy(desc(projects.startDate));
    return bulkEnrichProjects(rows);
  },
  ["projects-public"],
  { tags: ["projects"] },
);

/** Per-slug cache: each slug gets its own cache entry (fixes static-key collision bug). */
export function getProjectBySlug(slug: string): Promise<Project | null> {
  return unstable_cache(
    async (): Promise<Project | null> => {
      const [row] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.isPublic, true), eq(projects.slug, slug)))
        .limit(1);
      return row ? enrichProject(row) : null;
    },
    ["project-slug", slug],
    { tags: ["projects"] },
  )();
}

export const getFeaturedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await db
      .select()
      .from(projects)
      .where(and(eq(projects.isPublic, true), eq(projects.isFeatured, true)))
      .orderBy(desc(projects.startDate))
      .limit(3);
    return bulkEnrichProjects(rows);
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
    return bulkEnrichProjects(rows);
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
    return bulkEnrichProjects(rows);
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
    return bulkEnrichProjects(rows);
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
  return bulkEnrichProjects(rows);
}
