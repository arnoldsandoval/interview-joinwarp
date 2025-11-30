"use client";
import type { CalendarEvent } from "@repo/types";
import { memo } from "react";
import { cn } from "../lib/utils";
import { eventColors, formatEventTime } from "./calendar-context";
import { getEventLabel } from "./calendar-utils";

interface CalendarEventChipProps {
  event: CalendarEvent;
  timezone: string;
}

function EventIcon({ event }: { event: CalendarEvent }) {
  if (event.type === "time-off") {
    return <span className="text-md mr-1">✈️</span>;
  }
  if (event.type === "birthday") {
    return <span className="text-md mr-1">🎂</span>;
  }
  if (event.type === "anniversary") {
    return (
      <span className="text-[10px] font-semibold leading-none">
        <span className="text-md mr-1">🎉</span>
      </span>
    );
  }
  return null;
}

export const CalendarEventChip = memo(function CalendarEventChip({
  event,
  timezone,
}: CalendarEventChipProps) {
  const colors = eventColors[event.type];
  const isPersonEvent =
    event.type === "time-off" ||
    event.type === "birthday" ||
    event.type === "anniversary";

  // Person events show icon + name
  if (isPersonEvent) {
    const label = getEventLabel(event, timezone);
    return (
      <div
        className={cn(
          "tracking-tight px-2.5 py-1 rounded-full text-xs truncate font-semibold flex items-center gap-1 backdrop-blur-xs",
          colors.bg,
          colors.text
        )}
      >
        <EventIcon event={event} />
        <span className="truncate">
          {label}{" "}
          {event.type === "anniversary" && event.metadata?.yearsOfService
            ? `(${event.metadata.yearsOfService} years)`
            : ""}
        </span>
      </div>
    );
  }

  // Non-person events (company-event, deadline) show time + title
  const timeStr = formatEventTime(event, timezone);
  return (
    <div
      className={cn(
        "tracking-tight px-2.5 py-1 rounded-full text-xs truncate backdrop-blur-xs",
        colors.bg,
        colors.text
      )}
    >
      <span className="font-semibold">{event.title}</span>{" "}
      {timeStr && <span>{timeStr} </span>}
    </div>
  );
});
