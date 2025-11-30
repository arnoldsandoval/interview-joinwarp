"use client";
import { Anniversary, Birthday, TimeOff } from "@repo/icons";
import type { CalendarEvent } from "@repo/types";
import { cn } from "../lib/utils";
import { eventColors, formatEventTime } from "./calendar-context";
import { getEventLabel } from "./calendar-utils";

interface CalendarEventChipProps {
  event: CalendarEvent;
  timezone: string;
}

function EventIcon({ event }: { event: CalendarEvent }) {
  if (event.type === "time-off") {
    return <TimeOff className="size-3 shrink-0" />;
  }
  if (event.type === "birthday") {
    return <Birthday className="size-3 shrink-0" />;
  }
  if (event.type === "anniversary") {
    return (
      <span className="text-[10px] font-semibold leading-none">
        <Anniversary className="size-3 shrink-0" />
      </span>
    );
  }
  return null;
}

export function CalendarEventChip({ event, timezone }: CalendarEventChipProps) {
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
          "tracking-tight px-2.5 py-1 rounded-full text-xs truncate font-semibold flex items-center gap-1",
          colors.bg,
          colors.text
        )}
      >
        <EventIcon event={event} />
        <span className="truncate">
          {label}{" "}
          {event.type === "anniversary" && event.metadata?.yearsOfService
            ? `(${event.metadata.yearsOfService})`
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
        "tracking-tight px-2.5 py-1 rounded-full text-xs truncate",
        colors.bg,
        colors.text
      )}
    >
      {timeStr && <span>{timeStr} </span>}
      <span className="font-semibold">{event.title}</span>
    </div>
  );
}
