import { cn } from "../lib/utils";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

interface CalendarWeekHeaderProps {
  variant?: "default" | "mini";
}

export function CalendarWeekHeader({
  variant = "default",
}: CalendarWeekHeaderProps) {
  const isMini = variant === "mini";
  const days = isMini ? DAY_NAMES_SHORT : DAY_NAMES;

  return (
    <div className={cn("grid grid-cols-7", isMini && "-ml-1.5 mb-1")}>
      {days.map((day, index) => (
        <div
          key={`${day}-${index}`}
          className={
            isMini
              ? "text-[0.625rem] font-semibold text-muted-foreground text-center"
              : "border-b border-border px-3 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider"
          }
        >
          {day}
        </div>
      ))}
    </div>
  );
}
