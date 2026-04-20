"use server";

import { db } from "@/lib/db/drizzle";
import { news, newsProjects, newsPublications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/utils/slug";
import { safeRevalidateTag } from "@/lib/utils/revalidate";
import { requireRole } from "@/lib/permissions";
import type { ActionResult } from "@/types/action";

function requireString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`);
  }
  return value.trim();
}

export async function createNews(formData: FormData): Promise<ActionResult> {
  try { await requireRole("professor"); } catch (e) { if ((e as Error).message === "unauthorized") return { error: "권한이 없습니다." }; throw e; }

  let title: string;
  let category: string;
  let date: string;
  try {
    title = requireString(formData, "title");
    category = requireString(formData, "category");
    date = requireString(formData, "date");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const summary = (formData.get("summary") as string) || "";
  const isPinned = formData.get("isPinned") === "on";

  const projectIds = formData.getAll("projectIds") as string[];
  const publicationIds = formData.getAll("publicationIds") as string[];

  const slug = generateSlug(title);

  let newId: number;
  try {
    const [inserted] = await db
      .insert(news)
      .values({
        slug,
        title,
        summary,
        category,
        date: new Date(date),
        isPinned,
      })
      .returning({ id: news.id });
    if (!inserted) return { error: "뉴스 생성에 실패했습니다." };
    newId = inserted.id;
  } catch (e) {
    return { error: (e as Error).message };
  }

  try {
    if (projectIds.length > 0) {
      await db.insert(newsProjects).values(
        projectIds.map((projectId) => ({
          newsId: newId,
          projectId: parseInt(projectId, 10),
        })),
      );
    }

    if (publicationIds.length > 0) {
      await db.insert(newsPublications).values(
        publicationIds.map((publicationId) => ({
          newsId: newId,
          publicationId: parseInt(publicationId, 10),
        })),
      );
    }
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("news");
  return { success: true };
}

export async function updateNews(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try { await requireRole("professor"); } catch (e) { if ((e as Error).message === "unauthorized") return { error: "권한이 없습니다." }; throw e; }

  let title: string;
  let category: string;
  let date: string;
  try {
    title = requireString(formData, "title");
    category = requireString(formData, "category");
    date = requireString(formData, "date");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const summary = (formData.get("summary") as string) || "";
  const isPinned = formData.get("isPinned") === "on";

  const projectIds = formData.getAll("projectIds") as string[];
  const publicationIds = formData.getAll("publicationIds") as string[];

  const numId = parseInt(id, 10);
  if (isNaN(numId)) return { error: "Invalid news ID" };

  try {
    await db
      .update(news)
      .set({
        title,
        summary,
        category,
        date: new Date(date),
        isPinned,
      })
      .where(eq(news.id, numId));
  } catch (e) {
    return { error: (e as Error).message };
  }

  try {
    await db.delete(newsProjects).where(eq(newsProjects.newsId, numId));
    if (projectIds.length > 0) {
      await db.insert(newsProjects).values(
        projectIds.map((projectId) => ({
          newsId: numId,
          projectId: parseInt(projectId, 10),
        })),
      );
    }

    await db.delete(newsPublications).where(eq(newsPublications.newsId, numId));
    if (publicationIds.length > 0) {
      await db.insert(newsPublications).values(
        publicationIds.map((publicationId) => ({
          newsId: numId,
          publicationId: parseInt(publicationId, 10),
        })),
      );
    }
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("news");
  return { success: true };
}

export async function deleteNews(id: string): Promise<ActionResult> {
  try { await requireRole("professor"); } catch (e) { if ((e as Error).message === "unauthorized") return { error: "권한이 없습니다." }; throw e; }

  const numId = parseInt(id, 10);
  if (isNaN(numId)) return { error: "Invalid news ID" };

  try {
    // Join tables use ON DELETE CASCADE — no manual deletion needed
    await db.delete(news).where(eq(news.id, numId));
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("news");
  return { success: true };
}
