"use client";
import type { CalendarEvent as CalendarEventType } from "@repo/types";
import { memo } from "react";
import { useCalendar } from "./calendar-context";
import { CalendarEventChip } from "./calendar-event-chip";
import { cn } from "../lib/utils";

interface CalendarEventProps {
  event: CalendarEventType;
  startCol: number;
  span: number;
  row: number;
  onSelect: (date: Date) => void;
  weekIndex: number;
  week: Date[];
}

// Tailwind classes for row positioning (each row is 28px = 24px chip + 4px gap)
const rowTopClasses = [
  "top-0",
  "top-[28px]",
  "top-[56px]",
  "top-[84px]",
  "top-[112px]",
  "top-[140px]",
] as const;

// Tailwind classes for column start positions (6px to match cell p-1.5 padding)
const colLeftClasses = [
  "left-1.5",
  "left-[calc(14.2857%+6px)]",
  "left-[calc(28.5714%+6px)]",
  "left-[calc(42.8571%+6px)]",
  "left-[calc(57.1429%+6px)]",
  "left-[calc(71.4286%+6px)]",
  "left-[calc(85.7143%+6px)]",
] as const;

// Tailwind classes for span widths (12px total = 6px padding on each side)
const spanWidthClasses = [
  "w-[calc(14.2857%-12px)]",
  "w-[calc(28.5714%-12px)]",
  "w-[calc(42.8571%-12px)]",
  "w-[calc(57.1429%-12px)]",
  "w-[calc(71.4286%-12px)]",
  "w-[calc(85.7143%-12px)]",
  "w-[calc(100%-12px)]",
] as const;

export const CalendarEvent = memo(function CalendarEvent({
  event,
  startCol,
  span,
  row,
  onSelect,
  weekIndex,
  week,
}: CalendarEventProps) {
  const { timezone } = useCalendar();
  const topClass = rowTopClasses[row] || "top-0";
  const leftClass = colLeftClasses[startCol] || colLeftClasses[0];
  const widthClass = spanWidthClasses[span - 1] || spanWidthClasses[0];

  return (
    <div
      key={`${event.id}-${weekIndex}`}
      className={cn("absolute pointer-events-auto cursor-pointer", topClass, leftClass, widthClass)}
      onClick={(e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const dayIndex = Math.floor((e.clientX - rect.left) / (rect.width / span));
        onSelect(week[startCol + dayIndex]!);
      }}
    >
      <CalendarEventChip event={event} timezone={timezone} />
    </div>
  );
});
