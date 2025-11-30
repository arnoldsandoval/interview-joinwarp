import type { CalendarEvent } from "@repo/types";
import {
  differenceInDays,
  endOfWeek,
  isWithinInterval,
  max,
  min,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { formatEventTime } from "./calendar-context";

export interface SpanningEvent {
  event: CalendarEvent;
  startCol: number; // 0-6 column index within the week
  span: number; // number of days to span
  row: number; // vertical position for stacking
}

export interface WeekEventsResult {
  visibleEvents: SpanningEvent[];
  overflowByDay: number[]; // Count of hidden events per day (0-6)
}

export const MAX_VISIBLE_ROWS = 3;

export function getWeeks(days: Date[]): Date[][] {
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function getSpanningEventsForWeek(
  week: Date[],
  events: CalendarEvent[]
): SpanningEvent[] {
  if (week.length === 0) return [];
  const weekStart = startOfWeek(week[0]!);
  const weekEnd = endOfWeek(week[0]!);
  const spanningEvents: SpanningEvent[] = [];
  const rows: boolean[][] = []; // Track which cells are occupied

  // Filter to events that overlap this week (both multi-day and single-day)
  const weekEvents = events.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = event.endDate ? parseISO(event.endDate) : eventStart;

    // Check if event overlaps with this week
    return (
      isWithinInterval(weekStart, { start: eventStart, end: eventEnd }) ||
      isWithinInterval(weekEnd, { start: eventStart, end: eventEnd }) ||
      isWithinInterval(eventStart, { start: weekStart, end: weekEnd }) ||
      isWithinInterval(eventEnd, { start: weekStart, end: weekEnd })
    );
  });

  // Sort: all-day non-person events (holidays) first, then by start date, then by duration (longer first)
  weekEvents.sort((a, b) => {
    const aAllDay = a.allDay === true || !a.startDate.includes("T");
    const bAllDay = b.allDay === true || !b.startDate.includes("T");

    // All-day events without a person (company holidays) come first
    const aIsHoliday = aAllDay && !a.person;
    const bIsHoliday = bAllDay && !b.person;
    if (aIsHoliday !== bIsHoliday) return aIsHoliday ? -1 : 1;

    const aStart = parseISO(a.startDate);
    const bStart = parseISO(b.startDate);
    const aEnd = a.endDate ? parseISO(a.endDate) : aStart;
    const bEnd = b.endDate ? parseISO(b.endDate) : bStart;
    const startDiff = aStart.getTime() - bStart.getTime();
    if (startDiff !== 0) return startDiff;
    // Longer events first
    return differenceInDays(bEnd, bStart) - differenceInDays(aEnd, aStart);
  });

  for (const event of weekEvents) {
    // Normalize to start of day to avoid time component issues
    const eventStart = startOfDay(parseISO(event.startDate));
    const eventEnd = event.endDate
      ? startOfDay(parseISO(event.endDate))
      : eventStart;

    // Clamp to week boundaries
    const visibleStart = max([eventStart, weekStart]);
    const visibleEnd = min([eventEnd, weekEnd]);

    const startCol = differenceInDays(visibleStart, weekStart);
    const span = differenceInDays(visibleEnd, visibleStart) + 1;

    // Find first available row
    let row = 0;
    while (true) {
      if (!rows[row]) rows[row] = new Array(7).fill(false);
      let canFit = true;
      for (let col = startCol; col < startCol + span; col++) {
        if (rows[row]![col]) {
          canFit = false;
          break;
        }
      }
      if (canFit) break;
      row++;
    }

    // Mark cells as occupied
    if (!rows[row]) rows[row] = new Array(7).fill(false);
    for (let col = startCol; col < startCol + span; col++) {
      rows[row]![col] = true;
    }

    spanningEvents.push({ event, startCol, span, row });
  }

  return spanningEvents;
}

export function getWeekEventsWithOverflow(
  week: Date[],
  events: CalendarEvent[]
): WeekEventsResult {
  const allEvents = getSpanningEventsForWeek(week, events);

  // Separate visible events from overflow
  const visibleEvents: SpanningEvent[] = [];
  const overflowByDay = new Array(7).fill(0) as number[];

  for (const spanningEvent of allEvents) {
    if (spanningEvent.row < MAX_VISIBLE_ROWS) {
      visibleEvents.push(spanningEvent);
    } else {
      // Count overflow for each day this event spans
      for (
        let col = spanningEvent.startCol;
        col < spanningEvent.startCol + spanningEvent.span;
        col++
      ) {
        if (col >= 0 && col < 7) {
          overflowByDay[col] = (overflowByDay[col] ?? 0) + 1;
        }
      }
    }
  }

  return { visibleEvents, overflowByDay };
}

export function getEventLabel(event: CalendarEvent, timezone: string): string {
  const name = event.person ? event.person.firstName : event.title;
  const timeStr = formatEventTime(event, timezone);
  if (timeStr) {
    const startOnly = timeStr.split(" - ")[0];
    return `${startOnly} ${name}`;
  }
  return name;
}
