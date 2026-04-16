import { unstable_cache } from "next/cache";
import { db } from "@/lib/db/drizzle";
import {
  publications,
  publicationAuthors,
  publicationResearchAreas,
  publicationProjects,
  members,
} from "@/lib/db/schema";
import { eq, desc, inArray, and } from "drizzle-orm";
import type { Publication, Patent } from "@/types";

type PubRow = typeof publications.$inferSelect;

async function enrichPublication(row: PubRow): Promise<Publication> {
  const [authorRows, researchAreaRows, projectRows] = await Promise.all([
    db
      .select({ memberId: publicationAuthors.memberId, authorOrder: publicationAuthors.authorOrder })
      .from(publicationAuthors)
      .where(eq(publicationAuthors.publicationId, row.id))
      .orderBy(publicationAuthors.authorOrder),
    db
      .select({ researchAreaId: publicationResearchAreas.researchAreaId })
      .from(publicationResearchAreas)
      .where(eq(publicationResearchAreas.publicationId, row.id)),
    db
      .select({ projectId: publicationProjects.projectId })
      .from(publicationProjects)
      .where(eq(publicationProjects.publicationId, row.id)),
  ]);

  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    authors: row.authors ? [row.authors] : [],
    authorMemberIds: authorRows.map((a) => String(a.memberId)),
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
    researchAreaIds: researchAreaRows.map((r) => String(r.researchAreaId)),
    projectIds: projectRows.map((p) => String(p.projectId)),
    isFeatured: row.isFeatured ?? false,
    isPublic: row.isPublic ?? true,
    indexType: row.indexType ?? null,
    volumeInfo: row.volumeInfo ?? null,
  };
}

export const getPublications = unstable_cache(
  async (): Promise<Publication[]> => {
    const rows = await db
      .select()
      .from(publications)
      .where(eq(publications.isPublic, true))
      .orderBy(desc(publications.year), desc(publications.month));
    return Promise.all(rows.map(enrichPublication));
  },
  ["publications-public"],
  { tags: ["publications"] },
);

export const getPublicationBySlug = unstable_cache(
  async (slug: string): Promise<Publication | null> => {
    const [row] = await db
      .select()
      .from(publications)
      .where(and(eq(publications.isPublic, true), eq(publications.slug, slug)))
      .limit(1);
    return row ? enrichPublication(row) : null;
  },
  ["publication-slug"],
  { tags: ["publications"] },
);

export const getFeaturedPublications = unstable_cache(
  async (): Promise<Publication[]> => {
    const rows = await db
      .select()
      .from(publications)
      .where(and(eq(publications.isPublic, true), eq(publications.isFeatured, true)))
      .orderBy(desc(publications.year))
      .limit(3);
    return Promise.all(rows.map(enrichPublication));
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
      return Promise.all(rows.map(enrichPublication));
    },
    ["project-outputs", projectId],
    { tags: ["projects", "publications"] },
  )();

export async function getAllPublications(): Promise<Publication[]> {
  const rows = await db
    .select()
    .from(publications)
    .orderBy(desc(publications.year), desc(publications.month));
  return Promise.all(rows.map(enrichPublication));
}

export async function getPublicationById(id: string): Promise<Publication | null> {
  const [row] = await db
    .select()
    .from(publications)
    .where(eq(publications.id, Number(id)))
    .limit(1);
  return row ? enrichPublication(row) : null;
}

export async function getPublicationsByMember(memberId: string): Promise<Publication[]> {
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
  return Promise.all(rows.map(enrichPublication));
}
