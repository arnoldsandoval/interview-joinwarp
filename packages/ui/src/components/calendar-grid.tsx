"use client";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useMemo } from "react";
import { useCalendar } from "./calendar-context";
import { CalendarHeader } from "./calendar-header";
import { getWeekEventsWithOverflow, getWeeks } from "./calendar-utils";
import { CalendarWeek } from "./calendar-week";
import { CalendarWeekHeader } from "./calendar-week-header";

interface CalendarGridProps {
  variant?: "default" | "mini";
  /** For mini variant: the month to display (allows independent navigation) */
  displayMonth?: Date;
  /** For mini variant: callback when navigating months */
  onDisplayMonthChange?: (date: Date) => void;
}

export function CalendarGrid({
  variant = "default",
  displayMonth,
  onDisplayMonthChange,
}: CalendarGridProps) {
  const {
    currentMonth,
    goToToday,
    goToPreviousMonth,
    goToNextMonth,
    selectedDate,
    setSelectedDate,
    setCurrentMonth,
    calendarDays,
    filteredEvents,
  } = useCalendar();

  const isMini = variant === "mini";

  // For mini variant, use displayMonth if provided, otherwise use currentMonth
  const monthToShow = isMini && displayMonth ? displayMonth : currentMonth;

  // Calculate calendar days for the displayed month (for mini variant with independent navigation)
  const miniCalendarDays = useMemo(() => {
    if (!isMini || !displayMonth) return calendarDays;
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [isMini, displayMonth, calendarDays]);

  const daysToUse = isMini && displayMonth ? miniCalendarDays : calendarDays;
  const weeks = useMemo(() => getWeeks(daysToUse), [daysToUse]);

  // Pre-compute week events for all weeks at once (memoized to avoid recalculating on every render)
  const weekEventsData = useMemo(() => {
    if (isMini) return null;
    return weeks.map((week) => getWeekEventsWithOverflow(week, filteredEvents));
  }, [weeks, filteredEvents, isMini]);

  // Handle navigation for mini variant
  const handlePreviousMonth = () => {
    if (isMini && onDisplayMonthChange && displayMonth) {
      const newMonth = new Date(displayMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      onDisplayMonthChange(newMonth);
    } else {
      goToPreviousMonth();
    }
  };

  const handleNextMonth = () => {
    if (isMini && onDisplayMonthChange && displayMonth) {
      const newMonth = new Date(displayMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      onDisplayMonthChange(newMonth);
    } else {
      goToNextMonth();
    }
  };

  // Handle day selection for mini variant
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    // For mini variant, also navigate the main calendar to that month
    if (isMini) {
      setCurrentMonth(date);
    }
  };

  if (isMini) {
    return (
      <div className="w-full">
        <CalendarHeader
          currentMonth={monthToShow}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onToday={goToToday}
          showTodayButton={false}
          variant="mini"
        />

        <CalendarWeekHeader variant="mini" />

        <div>
          {weeks.map((week, weekIndex) => (
            <CalendarWeek
              key={weekIndex}
              week={week}
              weekIndex={weekIndex}
              currentMonth={monthToShow}
              spanningEvents={[]}
              onSelectDate={handleSelectDate}
              variant="mini"
              selectedDate={selectedDate}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        <CalendarHeader
          currentMonth={currentMonth}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
        />

        <CalendarWeekHeader />

        <div className="flex-1 flex flex-col">
          {weeks.map((week, weekIndex) => {
            const { visibleEvents, overflowByDay } = weekEventsData![weekIndex]!;

            return (
              <CalendarWeek
                key={weekIndex}
                week={week}
                weekIndex={weekIndex}
                currentMonth={currentMonth}
                spanningEvents={visibleEvents}
                overflowByDay={overflowByDay}
                onSelectDate={setSelectedDate}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
