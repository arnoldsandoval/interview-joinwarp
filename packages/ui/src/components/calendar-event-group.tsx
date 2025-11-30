"use client";
import type { CalendarEvent, EventType } from "@repo/types";
import { useMemo } from "react";
import { AvatarWithBadge } from "./avatar-with-badge";
import { CalendarEventChip } from "./calendar-event-chip";

interface EventGroupProps {
  events: CalendarEvent[];
  timezone: string;
}

function PersonEventSection({
  type,
  events,
}: {
  type: EventType;
  events: CalendarEvent[];
}) {
  const label =
    type === "time-off"
      ? "Time Off"
      : type === "birthday"
        ? "Birthdays"
        : "Anniversaries";

  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-xs leading-tight font-semibold text-muted-foreground">
        {label}
      </h3>
      <div className="flex flex-wrap gap-y-1">
        {events.map((event) => (
          <AvatarWithBadge
            key={event.id}
            src={event.person?.avatar}
            alt={event.person?.firstName}
            fallback={`${event.person?.firstName?.[0] ?? ""}${event.person?.lastName?.[0] ?? ""}`}
            eventType={type}
            yearsOfService={event.metadata?.yearsOfService}
            className="size-12"
            tooltip={`${event.person?.firstName ?? ""} ${event.person?.lastName ?? ""}`.trim() || undefined}
          />
        ))}
      </div>
    </div>
  );
}

function EventListSection({
  type,
  events,
  timezone,
}: {
  type: EventType;
  events: CalendarEvent[];
  timezone: string;
}) {
  const label = type === "company-event" ? "Company Events" : "Deadlines";

  return (
    <div>
      <h3 className="text-xs mb-1.5 leading-tight font-semibold text-muted-foreground">
        {label}
      </h3>
      <div className="space-y-1.5">
        {events.map((event) => (
          <CalendarEventChip key={event.id} event={event} timezone={timezone} />
        ))}
      </div>
    </div>
  );
}

export function EventGroup({ events, timezone }: EventGroupProps) {
  const groupedEvents = useMemo(() => {
    const groups: Partial<Record<EventType, CalendarEvent[]>> = {};
    for (const event of events) {
      if (!groups[event.type]) groups[event.type] = [];
      groups[event.type]!.push(event);
    }
    return groups;
  }, [events]);

  const personTypes: EventType[] = ["time-off", "birthday", "anniversary"];
  const eventTypes: EventType[] = ["company-event", "deadline"];

  const hasPersonEvents = personTypes.some(
    (type) => groupedEvents[type] && groupedEvents[type].length > 0
  );

  return (
    <div className="space-y-4">
      {eventTypes.map(
        (type) =>
          groupedEvents[type] &&
          groupedEvents[type].length > 0 && (
            <EventListSection
              key={type}
              type={type}
              events={groupedEvents[type]}
              timezone={timezone}
            />
          )
      )}{" "}
      {hasPersonEvents && (
        <div className="flex flex-wrap gap-x-4 gap-y-3">
          {personTypes.map(
            (type) =>
              groupedEvents[type] &&
              groupedEvents[type].length > 0 && (
                <PersonEventSection
                  key={type}
                  type={type}
                  events={groupedEvents[type]}
                />
              )
          )}
        </div>
      )}
    </div>
  );
}
