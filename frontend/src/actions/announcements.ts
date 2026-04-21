"use server";

import { db } from "@/lib/db/drizzle";
import { announcements, announcementAttachments, members } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { safeRevalidateTag } from "@/lib/utils/revalidate";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/permissions";
import { auth } from "@/lib/auth/auth";
import type { ActionResult } from "@/types/action";

async function getAuthorId(): Promise<number | null> {
  const session = await auth();
  if (!session?.user?.email) return null;
  const [member] = await db
    .select({ id: members.id })
    .from(members)
    .where(eq(members.email, session.user.email))
    .limit(1);
  return member?.id ?? null;
}

export async function createAnnouncement(formData: FormData): Promise<ActionResult> {
  try { await requireRole("professor"); } catch (e) { if ((e as Error).message === "unauthorized") return { error: "권한이 없습니다." }; throw e; }

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const isPinned = formData.get("isPinned") === "on";

  if (!title) return { error: "제목을 입력해주세요." };
  if (!content) return { error: "내용을 입력해주세요." };

  const authorId = await getAuthorId();

  try {
    await db.insert(announcements).values({ title, content, isPinned, authorId });
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("announcements");
  revalidatePath("/internal/board");
  revalidatePath("/professor/board");
  return { success: true };
}

export async function updateAnnouncement(id: number, formData: FormData): Promise<ActionResult> {
  try { await requireRole("professor"); } catch (e) { if ((e as Error).message === "unauthorized") return { error: "권한이 없습니다." }; throw e; }

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const isPinned = formData.get("isPinned") === "on";

  if (!title) return { error: "제목을 입력해주세요." };
  if (!content) return { error: "내용을 입력해주세요." };

  try {
    await db.update(announcements).set({
      title,
      content,
      isPinned,
      updatedAt: new Date(),
    }).where(eq(announcements.id, id));
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("announcements");
  revalidatePath("/internal/board");
  revalidatePath(`/internal/board/${id}`);
  revalidatePath("/professor/board");
  return { success: true };
}

export async function deleteAnnouncement(id: number): Promise<ActionResult> {
  try { await requireRole("professor"); } catch (e) { if ((e as Error).message === "unauthorized") return { error: "권한이 없습니다." }; throw e; }

  try {
    await db.delete(announcements).where(eq(announcements.id, id));
  } catch (e) {
    return { error: (e as Error).message };
  }

  safeRevalidateTag("announcements");
  revalidatePath("/internal/board");
  revalidatePath("/professor/board");
  return { success: true };
}

export async function incrementViewCount(id: number): Promise<void> {
  await db.update(announcements)
    .set({ viewCount: sql`${announcements.viewCount} + 1` })
    .where(eq(announcements.id, id));
}

export async function addAttachment(
  announcementId: number,
  data: { fileName: string; filePath: string; fileSize?: number; mimeType?: string }
): Promise<ActionResult> {
  try { await requireRole("professor"); } catch (e) { if ((e as Error).message === "unauthorized") return { error: "권한이 없습니다." }; throw e; }
  try {
    await db.insert(announcementAttachments).values({ announcementId, ...data });
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath(`/internal/board/${announcementId}`);
  return { success: true };
}

export async function deleteAttachment(id: number): Promise<ActionResult> {
  try { await requireRole("professor"); } catch (e) { if ((e as Error).message === "unauthorized") return { error: "권한이 없습니다." }; throw e; }
  try {
    await db.delete(announcementAttachments).where(eq(announcementAttachments.id, id));
  } catch (e) {
    return { error: (e as Error).message };
  }
  return { success: true };
}
