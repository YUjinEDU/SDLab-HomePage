"use server";

import { createClient } from "@/lib/db/supabase-server";
import { generateSlug } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";

export async function createNews(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;
  const isPinned = formData.get("isPinned") === "on";

  const projectIds = formData.getAll("projectIds") as string[];
  const publicationIds = formData.getAll("publicationIds") as string[];

  const id = crypto.randomUUID();
  const slug = generateSlug(title);

  const { error } = await supabase.from("news").insert({
    id,
    slug,
    title,
    summary,
    category,
    date,
    is_pinned: isPinned,
  });

  if (error) return { error: error.message };

  if (projectIds.length > 0) {
    await supabase.from("news_projects").insert(
      projectIds.map((projectId) => ({
        news_id: id,
        project_id: projectId,
      })),
    );
  }

  if (publicationIds.length > 0) {
    await supabase.from("news_publications").insert(
      publicationIds.map((publicationId) => ({
        news_id: id,
        publication_id: publicationId,
      })),
    );
  }

  revalidatePath("/professor/news");
  revalidatePath("/");
  return { success: true, id };
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;
  const isPinned = formData.get("isPinned") === "on";

  const projectIds = formData.getAll("projectIds") as string[];
  const publicationIds = formData.getAll("publicationIds") as string[];

  const { error } = await supabase
    .from("news")
    .update({
      title,
      summary,
      category,
      date,
      is_pinned: isPinned,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await supabase.from("news_projects").delete().eq("news_id", id);
  if (projectIds.length > 0) {
    await supabase.from("news_projects").insert(
      projectIds.map((projectId) => ({
        news_id: id,
        project_id: projectId,
      })),
    );
  }

  await supabase.from("news_publications").delete().eq("news_id", id);
  if (publicationIds.length > 0) {
    await supabase.from("news_publications").insert(
      publicationIds.map((publicationId) => ({
        news_id: id,
        publication_id: publicationId,
      })),
    );
  }

  revalidatePath("/professor/news");
  revalidatePath("/");
  return { success: true };
}

export async function deleteNews(id: string) {
  const supabase = await createClient();

  await supabase.from("news_projects").delete().eq("news_id", id);
  await supabase.from("news_publications").delete().eq("news_id", id);

  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/professor/news");
  revalidatePath("/");
  return { success: true };
}
