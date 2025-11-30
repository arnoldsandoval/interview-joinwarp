"use client";
import { CaretLeft, CaretRight } from "@repo/icons";
import { Button } from "@repo/ui";
import { format } from "date-fns";
import { cn } from "../lib/utils";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  showTodayButton?: boolean;
  variant?: "default" | "mini";
}

export function CalendarHeader({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onToday,
  showTodayButton = true,
  variant = "default",
}: CalendarHeaderProps) {
  const isMini = variant === "mini";

  return (
    <div className={cn("flex items-center justify-between", isMini && "mb-2")}>
      <h1
        className={cn(
          "font-semibold text-foreground",
          isMini ? "ml-1 text-base tracking-tight" : "text-3xl tracking-tighter"
        )}
      >
        {format(currentMonth, "MMMM")}{" "}
        <span className="font-normal">{format(currentMonth, "yyyy")}</span>
      </h1>

      <div className="flex gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onPreviousMonth}
          aria-label="Previous month"
        >
          <CaretLeft className={cn(isMini && "w-4 h-4")} />
        </Button>
        {showTodayButton && (
          <Button size="sm" variant="outline" onClick={onToday}>
            Today
          </Button>
        )}
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          <CaretRight className={cn(isMini && "w-4 h-4")} />
        </Button>
      </div>
    </div>
  );
}
