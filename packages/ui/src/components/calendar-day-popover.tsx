"use client";
import { format, isSameDay } from "date-fns";
import { X } from "lucide-react";
import { Button } from "./button";
import { useCalendar } from "./calendar-context";
import { CalendarDayCell } from "./calendar-day-cell";
import { EventGroup } from "./calendar-event-group";
import { Popover, PopoverAnchor, PopoverContent } from "./popover";

interface CalendarDayPopoverProps {
  day: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  variant?: "default" | "mini";
}

export function CalendarDayPopover({
  day,
  inCurrentMonth,
  isToday,
  isWeekend,
  variant = "default",
}: CalendarDayPopoverProps) {
  const {
    selectedDate,
    setSelectedDate,
    getEventsForDay,
    timezone,
    timezoneAbbr,
  } = useCalendar();

  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
  const events = getEventsForDay(day);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSelectedDate(day);
    } else {
      setSelectedDate(null);
    }
  };

  const handleClose = () => {
    setSelectedDate(null);
  };

  // Mini variant doesn't show popover
  if (variant === "mini") {
    return (
      <CalendarDayCell
        day={day}
        inCurrentMonth={inCurrentMonth}
        isToday={isToday}
        isWeekend={isWeekend}
        onSelect={setSelectedDate}
        variant={variant}
        isSelected={isSelected}
      />
    );
  }

  return (
    <Popover
      open={isSelected}
      onOpenChange={handleOpenChange}
      placement="right-start"
    >
      <PopoverAnchor
        render={(props) => (
          <div {...props} className="flex flex-col flex-1">
            <CalendarDayCell
              day={day}
              inCurrentMonth={inCurrentMonth}
              isToday={isToday}
              isWeekend={isWeekend}
              onSelect={setSelectedDate}
              variant={variant}
              isSelected={isSelected}
            />
          </div>
        )}
      />
      <PopoverContent className="w-86">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-xl tracking-tight">
              {format(day, "MMMM d, yyyy")}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleClose}
            aria-label="Close"
          >
            <X />
          </Button>
        </div>

        {events.length > 0 ? (
          <EventGroup events={events} timezone={timezone} />
        ) : (
          <p className="text-muted-foreground text-sm tracking-tight">
            No events scheduled
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
