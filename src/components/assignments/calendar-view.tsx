"use client";

import * as React from "react";
import { MonthCalendar, type CalendarItem } from "@/components/calendar/month-calendar";
import type { Assignment, Subject } from "@/types/database.types";

export function AssignmentCalendarView({ assignments, subjectsById }: { assignments: Assignment[]; subjectsById: Map<string, Subject> }) {
  const itemsByDate = React.useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    assignments
      .filter((a) => a.due_date)
      .forEach((a) => {
        const key = a.due_date as string;
        const subject = a.subject_id ? subjectsById.get(a.subject_id) : undefined;
        const list = map.get(key) ?? [];
        list.push({ id: a.id, label: a.title, color: subject?.color });
        map.set(key, list);
      });
    return map;
  }, [assignments, subjectsById]);

  return <MonthCalendar itemsByDate={itemsByDate} />;
}
