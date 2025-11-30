"use client";
import type { CalendarEvent } from "@repo/types";
import { CalendarProvider } from "./calendar-context";
import { CalendarDayDetails } from "./calendar-day-details";
import { CalendarGrid } from "./calendar-grid";
import { CalendarFilter } from "./calendar-filter";

interface CalendarProps {
  events: CalendarEvent[];
}

export function Calendar({ events }: CalendarProps) {
  return (
    <CalendarProvider events={events}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="grid gap-4">
          <CalendarFilter />
          <CalendarDayDetails />
        </div>
        <div className="flex-1 flex flex-col">
          <CalendarGrid />
        </div>
      </div>
    </CalendarProvider>
  );
}
