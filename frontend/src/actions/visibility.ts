"use server";

import { db } from "@/lib/db/drizzle";
import { publications, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { safeRevalidateTag } from "@/lib/utils/revalidate";
import { requireRole } from "@/lib/permissions";
import type { ActionResult } from "@/types/action";

export async function togglePublicationVisibility(
  id: string,
  isPublic: boolean,
): Promise<ActionResult> {
  try { await requireRole("professor"); } catch { return { error: "Unauthorized" }; }

  const pubId = parseInt(id, 10);
  if (isNaN(pubId)) return { error: "Invalid publication ID" };

  try {
    await db
      .update(publications)
      .set({ isPublic })
      .where(eq(publications.id, pubId));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Update failed" };
  }

  safeRevalidateTag("publications");
  return { success: true };
}

export async function toggleProjectVisibility(
  id: string,
  isPublic: boolean,
): Promise<ActionResult> {
  try { await requireRole("professor"); } catch { return { error: "Unauthorized" }; }

  const projId = parseInt(id, 10);
  if (isNaN(projId)) return { error: "Invalid project ID" };

  try {
    await db
      .update(projects)
      .set({ isPublic })
      .where(eq(projects.id, projId));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Update failed" };
  }

  safeRevalidateTag("projects");
  return { success: true };
}
