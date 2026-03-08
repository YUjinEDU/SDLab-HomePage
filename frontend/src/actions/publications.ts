"use server";

import { createClient } from "@/lib/db/supabase-server";
import { generateSlug } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";

export async function createPublication(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const authorsRaw = formData.get("authors") as string;
  const type = formData.get("type") as string;
  const venue = formData.get("venue") as string;
  const year = Number(formData.get("year"));
  const monthRaw = formData.get("month") as string;
  const doi = (formData.get("doi") as string) || null;
  const pdfUrl = (formData.get("pdfUrl") as string) || null;
  const abstract = (formData.get("abstract") as string) || null;
  const keywordsRaw = formData.get("keywords") as string;
  const bibtex = (formData.get("bibtex") as string) || null;
  const isFeatured = formData.get("isFeatured") === "on";

  const authors = authorsRaw
    ? authorsRaw
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
    : [];
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

  const id = crypto.randomUUID();
  const slug = generateSlug(title);

  const { error } = await supabase.from("publications").insert({
    id,
    slug,
    title,
    authors,
    type,
    venue,
    year,
    month,
    doi,
    pdf_url: pdfUrl,
    abstract,
    keywords,
    bibtex,
    is_featured: isFeatured,
  });

  if (error) return { error: error.message };

  if (authorMemberIds.length > 0) {
    await supabase.from("publication_authors").insert(
      authorMemberIds.map((memberId, index) => ({
        publication_id: id,
        member_id: memberId,
        author_order: index,
      })),
    );
  }

  if (researchAreaIds.length > 0) {
    await supabase.from("publication_research_areas").insert(
      researchAreaIds.map((areaId) => ({
        publication_id: id,
        research_area_id: areaId,
      })),
    );
  }

  if (projectIds.length > 0) {
    await supabase.from("publication_projects").insert(
      projectIds.map((projectId) => ({
        publication_id: id,
        project_id: projectId,
      })),
    );
  }

  revalidatePath("/professor/publications");
  revalidatePath("/professor/patents");
  revalidatePath("/publications");
  return { success: true, id };
}

export async function updatePublication(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const authorsRaw = formData.get("authors") as string;
  const type = formData.get("type") as string;
  const venue = formData.get("venue") as string;
  const year = Number(formData.get("year"));
  const monthRaw = formData.get("month") as string;
  const doi = (formData.get("doi") as string) || null;
  const pdfUrl = (formData.get("pdfUrl") as string) || null;
  const abstract = (formData.get("abstract") as string) || null;
  const keywordsRaw = formData.get("keywords") as string;
  const bibtex = (formData.get("bibtex") as string) || null;
  const isFeatured = formData.get("isFeatured") === "on";

  const authors = authorsRaw
    ? authorsRaw
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
    : [];
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

  const { error } = await supabase
    .from("publications")
    .update({
      title,
      authors,
      type,
      venue,
      year,
      month,
      doi,
      pdf_url: pdfUrl,
      abstract,
      keywords,
      bibtex,
      is_featured: isFeatured,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // Update join tables: delete then re-insert
  await supabase.from("publication_authors").delete().eq("publication_id", id);

  if (authorMemberIds.length > 0) {
    await supabase.from("publication_authors").insert(
      authorMemberIds.map((memberId, index) => ({
        publication_id: id,
        member_id: memberId,
        author_order: index,
      })),
    );
  }

  await supabase
    .from("publication_research_areas")
    .delete()
    .eq("publication_id", id);

  if (researchAreaIds.length > 0) {
    await supabase.from("publication_research_areas").insert(
      researchAreaIds.map((areaId) => ({
        publication_id: id,
        research_area_id: areaId,
      })),
    );
  }

  await supabase.from("publication_projects").delete().eq("publication_id", id);

  if (projectIds.length > 0) {
    await supabase.from("publication_projects").insert(
      projectIds.map((projectId) => ({
        publication_id: id,
        project_id: projectId,
      })),
    );
  }

  revalidatePath("/professor/publications");
  revalidatePath("/professor/patents");
  revalidatePath("/publications");
  return { success: true };
}

export async function deletePublication(id: string) {
  const supabase = await createClient();

  await supabase.from("publication_authors").delete().eq("publication_id", id);
  await supabase
    .from("publication_research_areas")
    .delete()
    .eq("publication_id", id);
  await supabase.from("publication_projects").delete().eq("publication_id", id);

  const { error } = await supabase.from("publications").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/professor/publications");
  revalidatePath("/professor/patents");
  revalidatePath("/publications");
  return { success: true };
}
