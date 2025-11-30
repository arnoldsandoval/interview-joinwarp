"use client";
import type { CalendarEvent, EventType } from "@repo/types";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Event colors shared across components (using dedicated event colors for better contrast)
export const eventColors: Record<
  EventType,
  { bg: string; text: string; border: string; checkbox: string }
> = {
  "time-off": {
    bg: "bg-event-time-off/20",
    text: "text-event-time-off",
    border: "border-event-time-off/30",
    checkbox:
      "peer-checked:bg-event-time-off/20 peer-checked:text-event-time-off peer-checked:border-event-time-off/30",
  },
  birthday: {
    bg: "bg-event-birthday/20",
    text: "text-event-birthday",
    border: "border-event-birthday/30",
    checkbox:
      "peer-checked:bg-event-birthday/20 peer-checked:text-event-birthday peer-checked:border-event-birthday/30",
  },
  anniversary: {
    bg: "bg-event-anniversary/20",
    text: "text-event-anniversary",
    border: "border-event-anniversary/30",
    checkbox:
      "peer-checked:bg-event-anniversary/20 peer-checked:text-event-anniversary peer-checked:border-event-anniversary/30",
  },
  "company-event": {
    bg: "bg-event-company/20",
    text: "text-event-company",
    border: "border-event-company/30",
    checkbox:
      "peer-checked:bg-event-company/20 peer-checked:text-event-company peer-checked:border-event-company/30",
  },
  deadline: {
    bg: "bg-event-deadline/20",
    text: "text-event-deadline",
    border: "border-event-deadline/30",
    checkbox:
      "peer-checked:bg-event-deadline/20 peer-checked:text-event-deadline peer-checked:border-event-deadline/30",
  },
};

export const ALL_EVENT_TYPES: EventType[] = [
  "time-off",
  "birthday",
  "anniversary",
  "company-event",
  "deadline",
];

// US timezone options for the timezone selector
export const US_TIMEZONES = [
  { value: "system", label: "System" },
  { value: "America/New_York", label: "Eastern" },
  { value: "America/Chicago", label: "Central" },
  { value: "America/Denver", label: "Mountain" },
  { value: "America/Los_Angeles", label: "Pacific" },
  { value: "America/Anchorage", label: "Alaska" },
  { value: "Pacific/Honolulu", label: "Hawaii" },
] as const;

// Utility functions
export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getTimezoneAbbreviation(timezone: string): string {
  const now = new Date();
  return formatInTimeZone(now, timezone, "zzz");
}

export function isAllDayEvent(event: CalendarEvent): boolean {
  return event.allDay === true || !event.startDate.includes("T");
}

function formatTime(
  date: Date,
  timezone: string,
  includePeriod: boolean = true
): string {
  const minutes = date.getMinutes();
  // Show just hour if minutes are :00, otherwise include minutes
  // Use 'aaa' for lowercase am/pm without space (e.g., "5pm" or "5:30pm")
  const fmt =
    minutes === 0
      ? includePeriod
        ? "haaa"
        : "h"
      : includePeriod
        ? "h:mmaaa"
        : "h:mm";
  return formatInTimeZone(date, timezone, fmt);
}

export function formatEventTime(
  event: CalendarEvent,
  timezone: string
): string | null {
  if (isAllDayEvent(event)) return null;

  const startDate = parseISO(event.startDate);

  if (event.endDate) {
    const endDate = parseISO(event.endDate);
    const startTime = formatTime(startDate, timezone, true);
    const endTime = formatTime(endDate, timezone, true);
    return `${startTime} - ${endTime}`;
  }

  return formatTime(startDate, timezone, true);
}

// Context types
interface CalendarContextValue {
  // Data
  events: CalendarEvent[];

  // Filters
  enabledEventTypes: Set<EventType>;
  toggleEventType: (type: EventType) => void;

  // Navigation
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  goToToday: () => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;

  // Selection
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;

  // Computed
  filteredEvents: CalendarEvent[];
  selectedDayEvents: CalendarEvent[];
  calendarDays: Date[];
  eventCountsByType: Record<EventType, number>;

  // Timezone
  timezone: string;
  timezoneAbbr: string;
  timezonePreference: string;
  setTimezone: (timezone: string) => void;

  // Helpers
  getEventsForDay: (day: Date) => CalendarEvent[];
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

interface CalendarProviderProps {
  events: CalendarEvent[];
  children: ReactNode;
}

export function CalendarProvider({ events, children }: CalendarProviderProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [enabledEventTypes, setEnabledEventTypes] = useState<Set<EventType>>(
    () => new Set(ALL_EVENT_TYPES)
  );
  const [timezonePreference, setTimezonePreference] = useState("system");

  const timezone = useMemo(
    () =>
      timezonePreference === "system"
        ? getLocalTimezone()
        : timezonePreference,
    [timezonePreference]
  );
  const timezoneAbbr = useMemo(
    () => getTimezoneAbbreviation(timezone),
    [timezone]
  );

  // Filter events by enabled types
  const filteredEvents = useMemo(() => {
    return events.filter((event) => enabledEventTypes.has(event.type));
  }, [events, enabledEventTypes]);

  // Calculate calendar days for current month view
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Get events for a specific day
  const getEventsForDay = useCallback(
    (day: Date): CalendarEvent[] => {
      return filteredEvents.filter((event) => {
        const startDate = parseISO(event.startDate);
        const endDate = event.endDate ? parseISO(event.endDate) : startDate;

        return (
          isSameDay(day, startDate) ||
          isSameDay(day, endDate) ||
          isWithinInterval(day, { start: startDate, end: endDate })
        );
      });
    },
    [filteredEvents]
  );

  // Events for selected day
  const selectedDayEvents = useMemo(() => {
    return selectedDate ? getEventsForDay(selectedDate) : [];
  }, [selectedDate, getEventsForDay]);

  // Count events by type within current calendar view
  const eventCountsByType = useMemo(() => {
    const counts: Record<EventType, number> = {
      "time-off": 0,
      birthday: 0,
      anniversary: 0,
      "company-event": 0,
      deadline: 0,
    };

    if (calendarDays.length === 0) return counts;

    const calendarStart = calendarDays[0];
    const calendarEnd = calendarDays[calendarDays.length - 1];

    for (const event of events) {
      const startDate = parseISO(event.startDate);
      const endDate = event.endDate ? parseISO(event.endDate) : startDate;

      if (startDate <= calendarEnd! && endDate >= calendarStart!) {
        counts[event.type]++;
      }
    }

    return counts;
  }, [events, calendarDays]);

  // Navigation functions
  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  // Toggle event type filter
  const toggleEventType = useCallback((type: EventType) => {
    setEnabledEventTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const value: CalendarContextValue = {
    events,
    enabledEventTypes,
    toggleEventType,
    currentMonth,
    setCurrentMonth,
    goToToday,
    goToPreviousMonth,
    goToNextMonth,
    selectedDate,
    setSelectedDate,
    filteredEvents,
    selectedDayEvents,
    calendarDays,
    eventCountsByType,
    timezone,
    timezoneAbbr,
    timezonePreference,
    setTimezone: setTimezonePreference,
    getEventsForDay,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): CalendarContextValue {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
