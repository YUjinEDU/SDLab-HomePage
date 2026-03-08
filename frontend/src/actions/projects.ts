"use server";

import { createClient } from "@/lib/db/supabase-server";
import { generateSlug } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const status = formData.get("status") as string;
  const category = formData.get("category") as string;
  const shortDescription = formData.get("shortDescription") as string;
  const fullDescription = (formData.get("fullDescription") as string) || null;
  const organization = formData.get("organization") as string;
  const programType = (formData.get("programType") as string) || null;
  const budget = (formData.get("budget") as string) || null;
  const startDate = formData.get("startDate") as string;
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

  revalidatePath("/professor/projects");
  revalidatePath("/projects");
  return { success: true, id };
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const status = formData.get("status") as string;
  const category = formData.get("category") as string;
  const shortDescription = formData.get("shortDescription") as string;
  const fullDescription = (formData.get("fullDescription") as string) || null;
  const organization = formData.get("organization") as string;
  const programType = (formData.get("programType") as string) || null;
  const budget = (formData.get("budget") as string) || null;
  const startDate = formData.get("startDate") as string;
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

  revalidatePath("/professor/projects");
  revalidatePath("/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();

  await supabase.from("project_members").delete().eq("project_id", id);
  await supabase.from("project_research_areas").delete().eq("project_id", id);

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/professor/projects");
  revalidatePath("/projects");
  return { success: true };
}
