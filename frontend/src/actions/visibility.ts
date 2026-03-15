"use server";

import { createClient } from "@/lib/db/supabase-server";
import { revalidateTag } from "next/cache";
import { assertRole } from "@/lib/permissions";

export async function togglePublicationVisibility(
  id: string,
  isPublic: boolean,
) {
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();
  const { error } = await supabase
    .from("publications")
    .update({ is_public: isPublic })
    .eq("id", id);

  if (error) return { error: error.message };

  // @ts-expect-error: Next.js 16 type requires 2 args but revalidateTag("tag") works at runtime
  revalidateTag("publications");
  return { success: true };
}

export async function toggleProjectVisibility(id: string, isPublic: boolean) {
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ is_public: isPublic })
    .eq("id", id);

  if (error) return { error: error.message };

  // @ts-expect-error: Next.js 16 type requires 2 args but revalidateTag("tag") works at runtime
  revalidateTag("projects");
  return { success: true };
}
