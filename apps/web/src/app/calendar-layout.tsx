"use client";
import { AuthMenu } from "@/components/auth-menu";
import type { CalendarEvent } from "@repo/types";
import {
  CalendarFilter,
  CalendarMini,
  CalendarProvider,
  CalendarToday,
  Logo,
} from "@repo/ui";
import type { ReactNode } from "react";

interface CalendarLayoutProps {
  events: CalendarEvent[];
  children: ReactNode;
}

// Mock user for demo purposes
const mockUser = {
  name: "Arnie Sandoval",
  email: "arnie@joinwarp.com",
  avatar: "https://avatars.githubusercontent.com/u/723659?v=4",
};

export function CalendarLayout({ events, children }: CalendarLayoutProps) {
  return (
    <CalendarProvider events={events}>
      <div className="grid grid-cols-[300px_1fr] h-screen bg-muted">
        <div className="flex flex-col gap-6 pt-8 px-8 pb-8">
          <div className="flex items-center justify-between">
            <Logo width={100} />
          </div>
          <div className="grid gap-8">
            <CalendarToday />
            <div className="-ml-1">
              <CalendarMini />
            </div>
            <CalendarFilter />
          </div>
          <div className="mt-auto">
            <AuthMenu user={mockUser} />
          </div>
        </div>
        <main className="bg-background rounded-tl-4xl rounded-bl-4xl py-8 px-10 shadow flex flex-col">
          {children}
        </main>
      </div>
    </CalendarProvider>
  );
}
