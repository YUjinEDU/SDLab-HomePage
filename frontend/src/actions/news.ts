"use server";

import { db } from "@/lib/db/drizzle";
import { news, newsProjects, newsPublications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";
import { assertRole } from "@/lib/permissions";
import type { ActionResult } from "@/types/action";

function requireString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`);
  }
  return value.trim();
}

export async function createNews(formData: FormData): Promise<ActionResult> {
  await assertRole("professor");

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

  revalidatePath("/professor/news");
  revalidatePath("/");
  return { success: true };
}

export async function updateNews(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await assertRole("professor");

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

  revalidatePath("/professor/news");
  revalidatePath("/");
  return { success: true };
}

export async function deleteNews(id: string): Promise<ActionResult> {
  await assertRole("professor");

  const numId = parseInt(id, 10);

  try {
    // Join tables use ON DELETE CASCADE — no manual deletion needed
    await db.delete(news).where(eq(news.id, numId));
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/professor/news");
  revalidatePath("/");
  return { success: true };
}
