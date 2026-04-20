import { unstable_cache } from "next/cache";
import { db } from "@/lib/db/drizzle";
import { news, newsProjects, newsPublications } from "@/lib/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import type { NewsItem } from "@/types";

type NewsRow = typeof news.$inferSelect;

/** Batch-fetches all join-table rows in 2 queries regardless of list size (avoids N+1). */
async function bulkEnrichNewsItems(rows: NewsRow[]): Promise<NewsItem[]> {
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);

  const [projectRows, publicationRows] = await Promise.all([
    db
      .select({ newsId: newsProjects.newsId, projectId: newsProjects.projectId })
      .from(newsProjects)
      .where(inArray(newsProjects.newsId, ids)),
    db
      .select({
        newsId: newsPublications.newsId,
        publicationId: newsPublications.publicationId,
      })
      .from(newsPublications)
      .where(inArray(newsPublications.newsId, ids)),
  ]);

  const projectMap = new Map<number, string[]>();
  for (const r of projectRows) {
    const arr = projectMap.get(r.newsId) ?? [];
    arr.push(String(r.projectId));
    projectMap.set(r.newsId, arr);
  }

  const pubMap = new Map<number, string[]>();
  for (const r of publicationRows) {
    const arr = pubMap.get(r.newsId) ?? [];
    arr.push(String(r.publicationId));
    pubMap.set(r.newsId, arr);
  }

  return rows.map((row) => ({
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? "",
    category: row.category as NewsItem["category"],
    date: row.date instanceof Date ? row.date.toISOString() : String(row.date),
    isPinned: row.isPinned ?? false,
    relatedProjectIds: projectMap.get(row.id) ?? [],
    relatedPublicationIds: pubMap.get(row.id) ?? [],
  }));
}

export const getNews = unstable_cache(
  async (): Promise<NewsItem[]> => {
    const rows = await db
      .select()
      .from(news)
      .orderBy(desc(news.isPinned), desc(news.date));
    return bulkEnrichNewsItems(rows);
  },
  ["news-all"],
  { tags: ["news"] },
);

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const [row] = await db
    .select()
    .from(news)
    .where(eq(news.id, Number(id)))
    .limit(1);
  if (!row) return null;
  const [result] = await bulkEnrichNewsItems([row]);
  return result ?? null;
}

/** Per-slug cache: each slug gets its own cache entry. */
export function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  return unstable_cache(
    async (): Promise<NewsItem | null> => {
      const [row] = await db
        .select()
        .from(news)
        .where(eq(news.slug, slug))
        .limit(1);
      if (!row) return null;
      const [result] = await bulkEnrichNewsItems([row]);
      return result ?? null;
    },
    ["news-by-slug", slug],
    { tags: ["news"] },
  )();
}

/** Limit is included in the cache key so different limits get separate entries. */
export function getLatestNews(limit = 4): Promise<NewsItem[]> {
  return unstable_cache(
    async (): Promise<NewsItem[]> => {
      const rows = await db
        .select()
        .from(news)
        .orderBy(desc(news.isPinned), desc(news.date))
        .limit(limit);
      return bulkEnrichNewsItems(rows);
    },
    ["news-latest", String(limit)],
    { tags: ["news"] },
  )();
}
