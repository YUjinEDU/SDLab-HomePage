import { db } from "@/lib/db/drizzle";
import { calendarEvents } from "@/lib/db/schema/content";

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
    .select()
    .from(calendarEvents)
    .orderBy(calendarEvents.start);

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    start: r.start.toISOString(),
    end: r.end ? r.end.toISOString() : null,
    allDay: r.allDay,
    color: r.color,
    description: r.description ?? null,
    authorName: null,
  }));
}
