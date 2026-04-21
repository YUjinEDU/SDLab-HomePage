import { db } from "@/lib/db/drizzle";
import { calendarEvents, members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type CalendarEventRow = {
  id: number;
  title: string;
  start: string;
  end: string | null;
  allDay: boolean;
  color: string;
  description: string | null;
  authorName: string | null;
};

export async function getCalendarEvents(): Promise<CalendarEventRow[]> {
  const rows = await db
    .select({
      id: calendarEvents.id,
      title: calendarEvents.title,
      start: calendarEvents.start,
      end: calendarEvents.end,
      allDay: calendarEvents.allDay,
      color: calendarEvents.color,
      description: calendarEvents.description,
      authorName: members.name,
    })
    .from(calendarEvents)
    .leftJoin(members, eq(calendarEvents.authorId, members.id))
    .orderBy(calendarEvents.start);

  return rows.map((r) => ({
    ...r,
    start: r.start.toISOString(),
    end: r.end ? r.end.toISOString() : null,
  }));
}
