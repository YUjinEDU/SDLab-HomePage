import { db } from "@/lib/db/drizzle";
import { news, newsProjects, newsPublications } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import type { NewsItem } from "@/types";

type NewsRow = typeof news.$inferSelect;

async function enrichNewsItem(row: NewsRow): Promise<NewsItem> {
  const [projectRows, publicationRows] = await Promise.all([
    db
      .select({ projectId: newsProjects.projectId })
      .from(newsProjects)
      .where(eq(newsProjects.newsId, row.id)),
    db
      .select({ publicationId: newsPublications.publicationId })
      .from(newsPublications)
      .where(eq(newsPublications.newsId, row.id)),
  ]);

  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? "",
    category: row.category as NewsItem["category"],
    date: row.date instanceof Date ? row.date.toISOString() : String(row.date),
    isPinned: row.isPinned ?? false,
    relatedProjectIds: projectRows.map((p) => String(p.projectId)),
    relatedPublicationIds: publicationRows.map((p) => String(p.publicationId)),
  };
}

export async function getNews(): Promise<NewsItem[]> {
  const rows = await db
    .select()
    .from(news)
    .orderBy(desc(news.isPinned), desc(news.date));
  return Promise.all(rows.map(enrichNewsItem));
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const [row] = await db
    .select()
    .from(news)
    .where(eq(news.id, Number(id)))
    .limit(1);
  return row ? enrichNewsItem(row) : null;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const [row] = await db
    .select()
    .from(news)
    .where(eq(news.slug, slug))
    .limit(1);
  return row ? enrichNewsItem(row) : null;
}

export async function getLatestNews(limit = 4): Promise<NewsItem[]> {
  const rows = await db
    .select()
    .from(news)
    .orderBy(desc(news.isPinned), desc(news.date))
    .limit(limit);
  return Promise.all(rows.map(enrichNewsItem));
}
