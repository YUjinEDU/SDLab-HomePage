"use server";

import { createClient } from "@/lib/db/supabase-server";
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
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();

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
  const budget = (formData.get("budget") as string) || null;
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

  const id = crypto.randomUUID();
  const slug = generateSlug(title);

  const { error } = await supabase.from("projects").insert({
    id,
    slug,
    title,
    status,
    category,
    short_description: shortDescription,
    full_description: fullDescription,
    organization,
    program_type: programType,
    budget,
    start_date: startDate,
    end_date: endDate,
    tags,
    demo_url: demoUrl,
    is_featured: isFeatured,
  });

  if (error) return { error: error.message };

  if (memberIds.length > 0) {
    await supabase.from("project_members").insert(
      memberIds.map((memberId) => ({
        project_id: id,
        member_id: memberId,
      })),
    );
  }

  if (researchAreaIds.length > 0) {
    await supabase.from("project_research_areas").insert(
      researchAreaIds.map((areaId) => ({
        project_id: id,
        research_area_id: areaId,
      })),
    );
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
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();

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
  const budget = (formData.get("budget") as string) || null;
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

  const { error } = await supabase
    .from("projects")
    .update({
      title,
      status,
      category,
      short_description: shortDescription,
      full_description: fullDescription,
      organization,
      program_type: programType,
      budget,
      start_date: startDate,
      end_date: endDate,
      tags,
      demo_url: demoUrl,
      is_featured: isFeatured,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await supabase.from("project_members").delete().eq("project_id", id);
  if (memberIds.length > 0) {
    await supabase.from("project_members").insert(
      memberIds.map((memberId) => ({
        project_id: id,
        member_id: memberId,
      })),
    );
  }

  await supabase.from("project_research_areas").delete().eq("project_id", id);
  if (researchAreaIds.length > 0) {
    await supabase.from("project_research_areas").insert(
      researchAreaIds.map((areaId) => ({
        project_id: id,
        research_area_id: areaId,
      })),
    );
  }

  safeRevalidateTag("projects");
  revalidatePath("/professor/projects");
  revalidatePath("/projects");
  return { success: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();

  await supabase.from("project_members").delete().eq("project_id", id);
  await supabase.from("project_research_areas").delete().eq("project_id", id);

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) return { error: error.message };

  safeRevalidateTag("projects");
  revalidatePath("/professor/projects");
  revalidatePath("/projects");
  return { success: true };
}
