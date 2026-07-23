"use client";

import * as React from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CalendarItem {
  id: string;
  label: string;
  color?: string;
  onClick?: () => void;
}

interface MonthCalendarProps {
  itemsByDate: Map<string, CalendarItem[]>;
  month?: Date;
  onMonthChange?: (month: Date) => void;
}

/** Shared month-grid primitive used by the Assignments calendar view and
 * the unified Calendar page — aggregates whatever `itemsByDate` it's given. */
export function MonthCalendar({ itemsByDate, month: controlledMonth, onMonthChange }: MonthCalendarProps) {
  const [internalMonth, setInternalMonth] = React.useState(() => startOfMonth(new Date()));
  const month = controlledMonth ?? internalMonth;
  const setMonth = onMonthChange ?? setInternalMonth;

  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-base font-semibold">{format(month, "MMMM yyyy")}</p>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonth(subMonths(month, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonth(new Date())}>
            <span className="text-[10px] font-medium">Today</span>
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonth(addMonths(month, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border text-center text-[11px] font-medium text-muted-foreground">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="bg-surface py-2">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const items = itemsByDate.get(key) ?? [];
          return (
            <div
              key={key}
              className={cn(
                "min-h-[88px] bg-surface p-1.5 text-left align-top",
                !isSameMonth(day, month) && "opacity-40"
              )}
            >
              <p className={cn("mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]", isToday(day) && "bg-accent text-accent-foreground")}>
                {format(day, "d")}
              </p>
              <div className="space-y-0.5">
                {items.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className="block w-full truncate rounded px-1 py-0.5 text-left text-[10px]"
                    style={{ backgroundColor: `${item.color ?? "#5B7FFF"}22`, color: item.color ?? "hsl(var(--foreground))" }}
                  >
                    {item.label}
                  </button>
                ))}
                {items.length > 3 && <p className="px-1 text-[10px] text-muted-foreground">+{items.length - 3} more</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
