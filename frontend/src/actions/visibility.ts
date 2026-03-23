"use server";

import { createClient } from "@/lib/db/supabase-server";
import { safeRevalidateTag } from "@/lib/utils/revalidate";
import { assertRole } from "@/lib/permissions";
import type { ActionResult } from "@/types/action";

export async function togglePublicationVisibility(
  id: string,
  isPublic: boolean,
): Promise<ActionResult> {
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();
  const { error } = await supabase
    .from("publications")
    .update({ is_public: isPublic })
    .eq("id", id);

  if (error) return { error: error.message };

  safeRevalidateTag("publications");
  return { success: true };
}

export async function toggleProjectVisibility(
  id: string,
  isPublic: boolean,
): Promise<ActionResult> {
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ is_public: isPublic })
    .eq("id", id);

  if (error) return { error: error.message };

  safeRevalidateTag("projects");
  return { success: true };
}
