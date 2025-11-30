"use client";
import { Calendar } from "@repo/icons";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { eventColors, formatEventTime, useCalendar } from "./calendar-context";

export function CalendarDayDetails() {
  const { selectedDate, selectedDayEvents, timezone, timezoneAbbr } =
    useCalendar();

  return (
    <div className="w-full">
      <div>
        {selectedDate ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md tracking-tight font-semibold text-foreground">
                {format(selectedDate, "MMMM d")}
              </h2>
              <span className="text-xs text-muted-foreground">
                {timezoneAbbr}
              </span>
            </div>
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDayEvents.map((event) => {
                  const colors = eventColors[event.type];
                  const timeStr = formatEventTime(event, timezone);
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "p-3 rounded-lg border",
                        colors.bg,
                        colors.border
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {event.person?.avatar && (
                          <img
                            src={event.person.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm font-semibold tracking-tight",
                              colors.text
                            )}
                          >
                            {event.person
                              ? `${event.person.firstName} ${event.person.lastName}`
                              : event.title}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize tracking-tight">
                            {event.type.replace("-", " ")}
                            {timeStr && ` · ${timeStr}`}
                          </p>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1 tracking-tight">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground tracking-tight">
                No events scheduled
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground tracking-tighter">
              Select a day to view events
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
