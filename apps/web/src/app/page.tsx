import { CalendarEvent } from "@repo/types";
import { CalendarGrid } from "@repo/ui";
import { CalendarLayout } from "./calendar-layout";

async function getEvents(): Promise<CalendarEvent[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/events`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const events = await getEvents();
  return (
    <CalendarLayout events={events}>
      <CalendarGrid />
    </CalendarLayout>
  );
}
