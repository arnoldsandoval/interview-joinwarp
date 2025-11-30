"use client";
import { useState } from "react";
import { CalendarGrid } from "./calendar-grid";

export function CalendarMini() {
  const [displayMonth, setDisplayMonth] = useState(() => new Date());

  return (
    <CalendarGrid
      variant="mini"
      displayMonth={displayMonth}
      onDisplayMonthChange={setDisplayMonth}
    />
  );
}
