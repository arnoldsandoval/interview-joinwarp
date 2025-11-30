export type EventType =
  | "time-off"
  | "birthday"
  | "anniversary"
  | "company-event"
  | "deadline";

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  startDate: string; // ISO 8601: "2025-01-15T10:00:00-08:00" or "2025-01-15" for all-day
  endDate?: string; // ISO 8601: same format
  allDay?: boolean;
  person?: Person;
  description?: string;
  metadata?: {
    yearsOfService?: number; // for anniversary events
  };
}
