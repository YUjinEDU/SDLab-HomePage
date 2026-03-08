import { createClient } from "@/lib/db/supabase-server";
import type { NewsItem } from "@/types";

type NewsRow = Record<string, unknown> & {
  news_projects?: { project_id: string }[];
  news_publications?: { publication_id: string }[];
};

const NEWS_SELECT = `
  *,
  news_projects(project_id),
  news_publications(publication_id)
`;

function toNewsItem(row: NewsRow): NewsItem {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    summary: row.summary as string,
    category: row.category as NewsItem["category"],
    date: row.date as string,
    isPinned: (row.is_pinned as boolean) ?? false,
    relatedProjectIds: (row.news_projects ?? []).map((p) => p.project_id),
    relatedPublicationIds: (row.news_publications ?? []).map(
      (p) => p.publication_id,
    ),
  };
}

export async function getNews(): Promise<NewsItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_SELECT)
    .order("is_pinned", { ascending: false })
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toNewsItem);
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_SELECT)
    .eq("id", id)
    .single();

  if (error) return null;
  return toNewsItem(data);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_SELECT)
    .eq("slug", slug)
    .single();

  if (error) return null;
  return toNewsItem(data);
}

export async function getLatestNews(limit = 4): Promise<NewsItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_SELECT)
    .order("is_pinned", { ascending: false })
    .order("date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(toNewsItem);
}
