"use server";

import { db } from "@/lib/db/drizzle";
import {
  projects,
  projectMembers,
  projectResearchAreas,
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

export async function createProject(formData: FormData): Promise<ActionResult> {
  await assertRole("professor");

  let title: string;
  let status: string;
  let category: string;
  let shortDescription: string;
  let organization: string;
  let startDate: string;
  try {
    title = requireString(formData, "title");
    status = requireString(formData, "status");
    category = requireString(formData, "category");
    shortDescription = requireString(formData, "shortDescription");
    organization = requireString(formData, "organization");
    startDate = requireString(formData, "startDate");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const fullDescription = (formData.get("fullDescription") as string) || null;
  const programType = (formData.get("programType") as string) || null;
  const budgetRaw = (formData.get("budget") as string) || null;
  const budget = budgetRaw ? parseInt(budgetRaw, 10) : null;
  const endDate = (formData.get("endDate") as string) || null;
  const tagsRaw = formData.get("tags") as string;
  const demoUrl = (formData.get("demoUrl") as string) || null;
  const isFeatured = formData.get("isFeatured") === "on";

  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const memberIds = formData.getAll("memberIds") as string[];
  const researchAreaIds = formData.getAll("researchAreaIds") as string[];

  const slug = generateSlug(title);

  let newId: number;
  try {
    const [inserted] = await db
      .insert(projects)
      .values({
        slug,
        title,
        status,
        category,
        shortDescription,
        fullDescription,
        organization,
        programType,
        budget,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        tags,
        demoUrl,
        isFeatured,
      })
      .returning({ id: projects.id });
    newId = inserted.id;
  } catch (e) {
    return { error: (e as Error).message };
  }

  try {
    if (memberIds.length > 0) {
      await db.insert(projectMembers).values(
        memberIds.map((memberId) => ({
          projectId: newId,
          memberId: parseInt(memberId, 10),
        })),
      );
    }

    if (researchAreaIds.length > 0) {
      await db.insert(projectResearchAreas).values(
        researchAreaIds.map((areaId) => ({
          projectId: newId,
          researchAreaId: parseInt(areaId, 10),
        })),
      );
    }
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("projects");
  revalidatePath("/professor/projects");
  revalidatePath("/projects");
  return { success: true };
}

export async function updateProject(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await assertRole("professor");

  let title: string;
  let status: string;
  let category: string;
  let shortDescription: string;
  let organization: string;
  let startDate: string;
  try {
    title = requireString(formData, "title");
    status = requireString(formData, "status");
    category = requireString(formData, "category");
    shortDescription = requireString(formData, "shortDescription");
    organization = requireString(formData, "organization");
    startDate = requireString(formData, "startDate");
  } catch (e) {
    return { error: (e as Error).message };
  }

  const fullDescription = (formData.get("fullDescription") as string) || null;
  const programType = (formData.get("programType") as string) || null;
  const budgetRaw = (formData.get("budget") as string) || null;
  const budget = budgetRaw ? parseInt(budgetRaw, 10) : null;
  const endDate = (formData.get("endDate") as string) || null;
  const tagsRaw = formData.get("tags") as string;
  const demoUrl = (formData.get("demoUrl") as string) || null;
  const isFeatured = formData.get("isFeatured") === "on";

  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const memberIds = formData.getAll("memberIds") as string[];
  const researchAreaIds = formData.getAll("researchAreaIds") as string[];

  const numId = parseInt(id, 10);

  try {
    await db
      .update(projects)
      .set({
        title,
        status,
        category,
        shortDescription,
        fullDescription,
        organization,
        programType,
        budget,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        tags,
        demoUrl,
        isFeatured,
      })
      .where(eq(projects.id, numId));
  } catch (e) {
    return { error: (e as Error).message };
  }

  try {
    await db.delete(projectMembers).where(eq(projectMembers.projectId, numId));
    if (memberIds.length > 0) {
      await db.insert(projectMembers).values(
        memberIds.map((memberId) => ({
          projectId: numId,
          memberId: parseInt(memberId, 10),
        })),
      );
    }

    await db
      .delete(projectResearchAreas)
      .where(eq(projectResearchAreas.projectId, numId));
    if (researchAreaIds.length > 0) {
      await db.insert(projectResearchAreas).values(
        researchAreaIds.map((areaId) => ({
          projectId: numId,
          researchAreaId: parseInt(areaId, 10),
        })),
      );
    }
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("projects");
  revalidatePath("/professor/projects");
  revalidatePath("/projects");
  return { success: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await assertRole("professor");

  const numId = parseInt(id, 10);

  try {
    await db.delete(projectMembers).where(eq(projectMembers.projectId, numId));
    await db
      .delete(projectResearchAreas)
      .where(eq(projectResearchAreas.projectId, numId));
    await db.delete(projects).where(eq(projects.id, numId));
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("projects");
  revalidatePath("/professor/projects");
  revalidatePath("/projects");
  return { success: true };
}
