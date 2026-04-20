import { unstable_cache } from "next/cache";
import { db } from "@/lib/db/drizzle";
import {
  publications,
  publicationAuthors,
  publicationResearchAreas,
  publicationProjects,
} from "@/lib/db/schema";
import { eq, desc, inArray, and } from "drizzle-orm";
import type { Publication, Patent } from "@/types";

type PubRow = typeof publications.$inferSelect;

/** Batch-fetches all join-table rows in 3 queries regardless of list size (avoids N+1). */
async function bulkEnrichPublications(rows: PubRow[]): Promise<Publication[]> {
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);

  const [authorRows, researchAreaRows, projectRows] = await Promise.all([
    db
      .select({
        publicationId: publicationAuthors.publicationId,
        memberId: publicationAuthors.memberId,
        authorOrder: publicationAuthors.authorOrder,
      })
      .from(publicationAuthors)
      .where(inArray(publicationAuthors.publicationId, ids))
      .orderBy(publicationAuthors.authorOrder),
    db
      .select({
        publicationId: publicationResearchAreas.publicationId,
        researchAreaId: publicationResearchAreas.researchAreaId,
      })
      .from(publicationResearchAreas)
      .where(inArray(publicationResearchAreas.publicationId, ids)),
    db
      .select({
        publicationId: publicationProjects.publicationId,
        projectId: publicationProjects.projectId,
      })
      .from(publicationProjects)
      .where(inArray(publicationProjects.publicationId, ids)),
  ]);

  // Group by publicationId, preserving authorOrder sort from DB
  const authorMap = new Map<number, Array<{ memberId: number; authorOrder: number }>>();
  for (const r of authorRows) {
    const arr = authorMap.get(r.publicationId) ?? [];
    arr.push({ memberId: r.memberId, authorOrder: r.authorOrder });
    authorMap.set(r.publicationId, arr);
  }

  const areaMap = new Map<number, string[]>();
  for (const r of researchAreaRows) {
    const arr = areaMap.get(r.publicationId) ?? [];
    arr.push(String(r.researchAreaId));
    areaMap.set(r.publicationId, arr);
  }

  const projMap = new Map<number, string[]>();
  for (const r of projectRows) {
    const arr = projMap.get(r.publicationId) ?? [];
    arr.push(String(r.projectId));
    projMap.set(r.publicationId, arr);
  }

  return rows.map((row) => ({
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    authors: row.authors ? row.authors.split(", ") : [],
    authorMemberIds: (authorMap.get(row.id) ?? []).map((a) => String(a.memberId)),
    type: row.type as Publication["type"],
    isInternational: row.isInternational ?? true,
    venue: row.venue ?? "",
    year: row.year,
    month: row.month ?? null,
    doi: row.doi ?? null,
    pdfUrl: row.pdfUrl ?? null,
    abstract: row.abstract ?? null,
    keywords: row.keywords ?? [],
    bibtex: row.bibtex ?? null,
    researchAreaIds: areaMap.get(row.id) ?? [],
    projectIds: projMap.get(row.id) ?? [],
    isFeatured: row.isFeatured ?? false,
    isPublic: row.isPublic ?? true,
    indexType: row.indexType ?? null,
    volumeInfo: row.volumeInfo ?? null,
  }));
}

async function enrichPublication(row: PubRow): Promise<Publication> {
  const [result] = await bulkEnrichPublications([row]);
  return result;
}

export const getPublications = unstable_cache(
  async (): Promise<Publication[]> => {
    const rows = await db
      .select()
      .from(publications)
      .where(eq(publications.isPublic, true))
      .orderBy(desc(publications.year), desc(publications.month));
    return bulkEnrichPublications(rows);
  },
  ["publications-public"],
  { tags: ["publications"] },
);

/** Per-slug cache: each slug gets its own cache entry (fixes static-key collision bug). */
export function getPublicationBySlug(slug: string): Promise<Publication | null> {
  return unstable_cache(
    async (): Promise<Publication | null> => {
      const [row] = await db
        .select()
        .from(publications)
        .where(and(eq(publications.isPublic, true), eq(publications.slug, slug)))
        .limit(1);
      return row ? enrichPublication(row) : null;
    },
    ["publication-slug", slug],
    { tags: ["publications"] },
  )();
}

export const getFeaturedPublications = unstable_cache(
  async (): Promise<Publication[]> => {
    const rows = await db
      .select()
      .from(publications)
      .where(and(eq(publications.isPublic, true), eq(publications.isFeatured, true)))
      .orderBy(desc(publications.year))
      .limit(3);
    return bulkEnrichPublications(rows);
  },
  ["publications-featured"],
  { tags: ["publications"] },
);

// TODO: Phase 8 will replace these stubs with real queries against the new patents table.
// Migration 005 moved patents out of publications into a dedicated patents table.
// These stubs return empty data to prevent runtime breakage in patent pages.
export const getPatents = async (): Promise<Patent[]> => [];

export const getPatentBySlug = async (_slug: string): Promise<Patent | null> =>
  null;

export const getProjectOutputs = (projectId: string) =>
  unstable_cache(
    async (): Promise<Publication[]> => {
      const joinRows = await db
        .select({ publicationId: publicationProjects.publicationId })
        .from(publicationProjects)
        .where(eq(publicationProjects.projectId, Number(projectId)));

      if (!joinRows.length) return [];

      const pubIds = joinRows.map((r) => r.publicationId);
      const rows = await db
        .select()
        .from(publications)
        .where(and(eq(publications.isPublic, true), inArray(publications.id, pubIds)))
        .orderBy(desc(publications.year));
      return bulkEnrichPublications(rows);
    },
    ["project-outputs", projectId],
    { tags: ["projects", "publications"] },
  )();

export const getAllPublications = unstable_cache(
  async (): Promise<Publication[]> => {
    const rows = await db
      .select()
      .from(publications)
      .orderBy(desc(publications.year), desc(publications.month));
    return bulkEnrichPublications(rows);
  },
  ["all-publications"],
  { tags: ["publications"] },
);

export async function getPublicationById(id: string): Promise<Publication | null> {
  const [row] = await db
    .select()
    .from(publications)
    .where(eq(publications.id, Number(id)))
    .limit(1);
  return row ? enrichPublication(row) : null;
}

export const getPublicationsByMember = (memberId: string) =>
  unstable_cache(
    async (): Promise<Publication[]> => {
      const authorRows = await db
        .select({ publicationId: publicationAuthors.publicationId })
        .from(publicationAuthors)
        .where(eq(publicationAuthors.memberId, Number(memberId)));

      if (!authorRows.length) return [];

      const pubIds = authorRows.map((r) => r.publicationId);
      const rows = await db
        .select()
        .from(publications)
        .where(and(eq(publications.isPublic, true), inArray(publications.id, pubIds)))
        .orderBy(desc(publications.year));
      return bulkEnrichPublications(rows);
    },
    ["publications-by-member", memberId],
    { tags: ["publications"] },
  )();
