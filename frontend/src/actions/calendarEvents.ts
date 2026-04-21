"use server";

import { db } from "@/lib/db/drizzle";
import { calendarEvents, members } from "@/lib/db/schema/content";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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

export type CalendarEventInput = {
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  color?: string;
  description?: string;
};

export async function createCalendarEvent(data: CalendarEventInput): Promise<ActionResult> {
  const authorId = await getAuthorId();
  if (!authorId) return { error: "로그인이 필요합니다." };
  if (!data.title?.trim()) return { error: "제목을 입력해주세요." };
  if (!data.start) return { error: "시작 일시를 입력해주세요." };

  try {
    const [row] = await db.insert(calendarEvents).values({
      title: data.title.trim(),
      start: new Date(data.start),
      end: data.end ? new Date(data.end) : null,
      allDay: data.allDay ?? false,
      color: data.color ?? "#059669",
      description: data.description?.trim() ?? null,
      authorId,
    }).returning({ id: calendarEvents.id });
    revalidatePath("/internal/calendar");
    return { success: true, id: row.id };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function updateCalendarEvent(id: number, data: CalendarEventInput): Promise<ActionResult> {
  const authorId = await getAuthorId();
  if (!authorId) return { error: "로그인이 필요합니다." };
  if (!data.title?.trim()) return { error: "제목을 입력해주세요." };

  try {
    await db.update(calendarEvents).set({
      title: data.title.trim(),
      start: new Date(data.start),
      end: data.end ? new Date(data.end) : null,
      allDay: data.allDay ?? false,
      color: data.color ?? "#059669",
      description: data.description?.trim() ?? null,
    }).where(eq(calendarEvents.id, id));
    revalidatePath("/internal/calendar");
    return { success: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteCalendarEvent(id: number): Promise<ActionResult> {
  const authorId = await getAuthorId();
  if (!authorId) return { error: "로그인이 필요합니다." };

  try {
    await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
    revalidatePath("/internal/calendar");
    return { success: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
