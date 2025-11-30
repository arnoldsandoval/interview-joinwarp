"use client";
import { format, isToday, parseISO, startOfDay } from "date-fns";
import { useMemo } from "react";
import { useCalendar } from "./calendar-context";
import { EventGroup } from "./calendar-event-group";

export function CalendarToday() {
  const { events, timezone, enabledEventTypes } = useCalendar();

  // Stabilize today's date to avoid new reference on every render
  const today = useMemo(() => startOfDay(new Date()), []);

  const todayEvents = useMemo(() => {
    return events.filter((event) => {
      if (!enabledEventTypes.has(event.type)) return false;

      const startDate = parseISO(event.startDate);
      const endDate = event.endDate ? parseISO(event.endDate) : startDate;

      return (
        isToday(startDate) ||
        isToday(endDate) ||
        (startDate <= today && endDate >= today)
      );
    });
  }, [events, enabledEventTypes, today]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-md tracking-tight font-semibold text-foreground">
        Today · <span className="font-light">{format(today, "MMMM d")}</span>
      </h2>
      {todayEvents.length > 0 ? (
        <EventGroup events={todayEvents} timezone={timezone} />
      ) : (
        <p className="text-sm text-muted-foreground tracking-tight">
          Nothing scheduled for today
        </p>
      )}
    </div>
  );
}
