import { getCalendarEvents } from "@/lib/queries/calendarEvents";
import { CalendarClient } from "@/components/calendar/CalendarClient";

export default async function CalendarPage() {
  const events = await getCalendarEvents();
  return <CalendarClient initialEvents={events} />;
}
