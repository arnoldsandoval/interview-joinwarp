"use client";
import { cn } from "../lib/utils";
import { ALL_EVENT_TYPES, eventColors, useCalendar } from "./calendar-context";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

export function CalendarFilter() {
  const { enabledEventTypes, toggleEventType, eventCountsByType } =
    useCalendar();

  return (
    <div className="mt-4 flex flex-col gap-2">
      <h2 className="text-md tracking-tight font-semibold text-foreground">
        Calendars
      </h2>
      <div className="text-sm grid gap-2.5">
        {ALL_EVENT_TYPES.map((type) => {
          const colors = eventColors[type];
          const isEnabled = enabledEventTypes.has(type);

          return (
            <div key={type} className="flex items-center gap-3">
              <Checkbox
                id={`calendar-${type}`}
                checked={isEnabled}
                onChange={() => toggleEventType(type)}
                className={colors.checkbox}
              />
              <Label
                htmlFor={`calendar-${type}`}
                className={cn(
                  "flex-1 capitalize tracking-tight font-medium text-md cursor-pointer",
                  isEnabled ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {type.replace("-", " ")}
                {eventCountsByType[type] > 0 && (
                  <span
                    className={cn(
                      "ml-1 bg-background px-2 shadow-xs rounded-full h-4 flex items-center justify-center text-xs font-bold text-muted-foreground",
                      isEnabled ? "opacity-100" : "opacity-50"
                    )}
                  >
                    {eventCountsByType[type]}
                  </span>
                )}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
