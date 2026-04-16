"use server";

import { db } from "@/lib/db/drizzle";
import {
  publications,
  publicationAuthors,
  publicationResearchAreas,
  publicationProjects,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";
import { safeRevalidateTag } from "@/lib/utils/revalidate";
import { assertRole } from "@/lib/permissions";
import type { ActionResult } from "@/types/action";

function requireString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`);
  }
  return value.trim();
}

export async function createPublication(
  formData: FormData,
): Promise<ActionResult> {
  await assertRole("professor");

  let title: string;
  let authorsRaw: string;
  let type: string;
  let venue: string;
  try {
    title = requireString(formData, "title");
    authorsRaw = requireString(formData, "authors");
    type = requireString(formData, "type");
    venue = requireString(formData, "venue");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const year = Number(formData.get("year"));
  const monthRaw = formData.get("month") as string;
  const doi = (formData.get("doi") as string) || null;
  const pdfUrl = (formData.get("pdfUrl") as string) || null;
  const abstract = (formData.get("abstract") as string) || null;
  const keywordsRaw = formData.get("keywords") as string;
  const bibtex = (formData.get("bibtex") as string) || null;
  const isFeatured = formData.get("isFeatured") === "on";

  // schema: authors is text (comma-separated string), not array
  const authors = authorsRaw;
  const keywords = keywordsRaw
    ? keywordsRaw
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : [];
  const month = monthRaw ? Number(monthRaw) : null;

  const authorMemberIds = formData.getAll("authorMemberIds") as string[];
  const researchAreaIds = formData.getAll("researchAreaIds") as string[];
  const projectIds = formData.getAll("projectIds") as string[];

  const slug = generateSlug(title);

  let newId: number;
  try {
    const [inserted] = await db
      .insert(publications)
      .values({
        slug,
        title,
        authors,
        type,
        venue,
        year,
        month,
        doi,
        pdfUrl,
        abstract,
        keywords,
        bibtex,
        isFeatured,
      })
      .returning({ id: publications.id });
    newId = inserted.id;
  } catch (e) {
    return { error: (e as Error).message };
  }

  try {
    if (authorMemberIds.length > 0) {
      await db.insert(publicationAuthors).values(
        authorMemberIds.map((memberId, index) => ({
          publicationId: newId,
          memberId: parseInt(memberId, 10),
          authorOrder: index,
        })),
      );
    }

    if (researchAreaIds.length > 0) {
      await db.insert(publicationResearchAreas).values(
        researchAreaIds.map((areaId) => ({
          publicationId: newId,
          researchAreaId: parseInt(areaId, 10),
        })),
      );
    }

    if (projectIds.length > 0) {
      await db.insert(publicationProjects).values(
        projectIds.map((projectId) => ({
          publicationId: newId,
          projectId: parseInt(projectId, 10),
        })),
      );
    }
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("publications");
  revalidatePath("/professor/publications");
  revalidatePath("/professor/patents");
  revalidatePath("/publications");
  return { success: true };
}

export async function updatePublication(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await assertRole("professor");

  let title: string;
  let authorsRaw: string;
  let type: string;
  let venue: string;
  try {
    title = requireString(formData, "title");
    authorsRaw = requireString(formData, "authors");
    type = requireString(formData, "type");
    venue = requireString(formData, "venue");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const year = Number(formData.get("year"));
  const monthRaw = formData.get("month") as string;
  const doi = (formData.get("doi") as string) || null;
  const pdfUrl = (formData.get("pdfUrl") as string) || null;
  const abstract = (formData.get("abstract") as string) || null;
  const keywordsRaw = formData.get("keywords") as string;
  const bibtex = (formData.get("bibtex") as string) || null;
  const isFeatured = formData.get("isFeatured") === "on";

  const authors = authorsRaw;
  const keywords = keywordsRaw
    ? keywordsRaw
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : [];
  const month = monthRaw ? Number(monthRaw) : null;

  const authorMemberIds = formData.getAll("authorMemberIds") as string[];
  const researchAreaIds = formData.getAll("researchAreaIds") as string[];
  const projectIds = formData.getAll("projectIds") as string[];

  const numId = parseInt(id, 10);

  try {
    await db
      .update(publications)
      .set({
        title,
        authors,
        type,
        venue,
        year,
        month,
        doi,
        pdfUrl,
        abstract,
        keywords,
        bibtex,
        isFeatured,
      })
      .where(eq(publications.id, numId));
  } catch (e) {
    return { error: (e as Error).message };
  }

  try {
    // Update join tables: delete then re-insert
    await db
      .delete(publicationAuthors)
      .where(eq(publicationAuthors.publicationId, numId));
    if (authorMemberIds.length > 0) {
      await db.insert(publicationAuthors).values(
        authorMemberIds.map((memberId, index) => ({
          publicationId: numId,
          memberId: parseInt(memberId, 10),
          authorOrder: index,
        })),
      );
    }

    await db
      .delete(publicationResearchAreas)
      .where(eq(publicationResearchAreas.publicationId, numId));
    if (researchAreaIds.length > 0) {
      await db.insert(publicationResearchAreas).values(
        researchAreaIds.map((areaId) => ({
          publicationId: numId,
          researchAreaId: parseInt(areaId, 10),
        })),
      );
    }

    await db
      .delete(publicationProjects)
      .where(eq(publicationProjects.publicationId, numId));
    if (projectIds.length > 0) {
      await db.insert(publicationProjects).values(
        projectIds.map((projectId) => ({
          publicationId: numId,
          projectId: parseInt(projectId, 10),
        })),
      );
    }
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("publications");
  revalidatePath("/professor/publications");
  revalidatePath("/professor/patents");
  revalidatePath("/publications");
  return { success: true };
}

export async function deletePublication(id: string): Promise<ActionResult> {
  await assertRole("professor");

  const numId = parseInt(id, 10);

  try {
    await db
      .delete(publicationAuthors)
      .where(eq(publicationAuthors.publicationId, numId));
    await db
      .delete(publicationResearchAreas)
      .where(eq(publicationResearchAreas.publicationId, numId));
    await db
      .delete(publicationProjects)
      .where(eq(publicationProjects.publicationId, numId));
    await db.delete(publications).where(eq(publications.id, numId));
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("publications");
  revalidatePath("/professor/publications");
  revalidatePath("/professor/patents");
  revalidatePath("/publications");
  return { success: true };
}
