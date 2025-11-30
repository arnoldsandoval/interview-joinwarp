"use client";
import { format } from "date-fns";
import { memo } from "react";
import { cn } from "../lib/utils";

interface CalendarDayCellProps {
  day: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  onSelect: (day: Date) => void;
  variant?: "default" | "mini";
  isSelected?: boolean;
}

export const CalendarDayCell = memo(function CalendarDayCell({
  day,
  inCurrentMonth,
  isToday,
  isWeekend,
  onSelect,
  variant = "default",
  isSelected = false,
}: CalendarDayCellProps) {
  const isMini = variant === "mini";

  if (isMini) {
    return (
      <div
        onClick={() => onSelect(day)}
        className={cn(
          "size-6.5 flex items-center justify-center cursor-pointer rounded-full mx-auto",
          !inCurrentMonth ? "text-muted-foreground" : "text-foreground",
          isSelected ? "bg-background shadow text-foreground font-bold" : "",
          isToday ? "bg-foreground text-background font-semibold" : ""
        )}
      >
        <span className="text-xs">{format(day, "d")}</span>
      </div>
    );
  }

  return (
    <div
      key={day.toISOString()}
      onClick={() => onSelect(day)}
      className={cn(
        "min-h-20 border-b border-border p-1.5 cursor-pointer transition-colors flex flex-col flex-1",
        !inCurrentMonth
          ? "bg-[url(/pattern-null.svg)] dark:bg-[url(/pattern-null-dark.svg)]"
          : "hover:bg-accent",
        isWeekend ? "bg-muted/50" : "",
        isSelected ? "bg-accent" : ""
      )}
    >
      <div
        className={cn(
          "font-semibold tracking-tighter mb-1 w-7 h-7 flex items-center justify-center rounded-full shrink-0",
          !inCurrentMonth ? "text-muted-foreground/50" : "text-foreground",
          isSelected ? "bg-background text-foreground shadow" : "",
          isToday ? "bg-primary text-primary-foreground" : ""
        )}
      >
        {format(day, "d")}
      </div>
    </div>
  );
});
