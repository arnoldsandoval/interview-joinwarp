"use client";
import { ALL_EVENT_TYPES, eventColors, useCalendar } from "./calendar-context";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { cn } from "../lib/utils";

export function CalendarSelector() {
  const { enabledEventTypes, toggleEventType } = useCalendar();

  return (
    <div className="mt-4 flex flex-col gap-2">
      <h2 className="text-md tracking-tight font-semibold text-foreground">
        Calendars
      </h2>
      <div className="text-sm grid gap-1.5">
        {ALL_EVENT_TYPES.map((type) => {
          const colors = eventColors[type];
          const isEnabled = enabledEventTypes.has(type);

          return (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`calendar-${type}`}
                checked={isEnabled}
                onChange={() => toggleEventType(type)}
                className={cn(
                  isEnabled && colors.bg,
                  isEnabled && colors.border,
                  isEnabled && colors.text
                )}
              />
              <Label
                htmlFor={`calendar-${type}`}
                className={cn(
                  "capitalize tracking-tight font-medium text-md cursor-pointer",
                  isEnabled ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {type.replace("-", " ")}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
