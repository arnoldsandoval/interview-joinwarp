"use client";
import { isSameDay, isSameMonth, isToday } from "date-fns";
import { CalendarDayCell } from "./calendar-day-cell";
import { CalendarDayPopover } from "./calendar-day-popover";
import { CalendarEvent } from "./calendar-event";
import { MAX_VISIBLE_ROWS, type SpanningEvent } from "./calendar-utils";

interface CalendarWeekProps {
  week: Date[];
  weekIndex: number;
  currentMonth: Date;
  spanningEvents: SpanningEvent[];
  overflowByDay?: number[];
  onSelectDate: (date: Date) => void;
  variant?: "default" | "mini";
  selectedDate?: Date | null;
}

export function CalendarWeek({
  week,
  weekIndex,
  currentMonth,
  spanningEvents,
  overflowByDay,
  onSelectDate,
  variant = "default",
  selectedDate,
}: CalendarWeekProps) {
  const isMini = variant === "mini";

  return (
    <div
      className={
        isMini
          ? "-ml-1.5 grid grid-cols-7 py-0.5"
          : "flex-1 grid grid-cols-7 relative"
      }
    >
      {/* Events layer - only for default variant */}
      {!isMini && (
        <div className="absolute left-0 right-0 pointer-events-none top-10">
          {spanningEvents.map(({ event, startCol, span, row }) => (
            <CalendarEvent
              key={`${event.id}-${weekIndex}`}
              event={event}
              startCol={startCol}
              span={span}
              row={row}
              onSelect={onSelectDate}
              weekIndex={weekIndex}
              week={week}
            />
          ))}
          {/* Overflow indicators */}
          {overflowByDay?.map((count, dayIndex) =>
            count > 0 ? (
              <div
                key={`overflow-${dayIndex}`}
                className="absolute text-xs text-muted-foreground px-1.5"
                style={{
                  top: MAX_VISIBLE_ROWS * 28,
                  left: `calc(${(dayIndex / 7) * 100}% + 6px)`,
                }}
              >
                +{count} more
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Day cells */}
      {week.map((day) => {
        const inCurrentMonth = isSameMonth(day, currentMonth);
        const todayDate = isToday(day);
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

        // Use popover for default variant, plain cell for mini
        if (isMini) {
          return (
            <CalendarDayCell
              key={day.toISOString()}
              day={day}
              inCurrentMonth={inCurrentMonth}
              isToday={todayDate}
              isWeekend={isWeekend}
              onSelect={onSelectDate}
              variant={variant}
              isSelected={isSelected}
            />
          );
        }

        return (
          <CalendarDayPopover
            key={day.toISOString()}
            day={day}
            inCurrentMonth={inCurrentMonth}
            isToday={todayDate}
            isWeekend={isWeekend}
          />
        );
      })}
    </div>
  );
}
