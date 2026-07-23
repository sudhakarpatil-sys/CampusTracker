"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MonthCalendar, type CalendarItem } from "@/components/calendar/month-calendar";
import { Badge } from "@/components/ui/badge";
import { useAssignments } from "@/hooks/use-assignments";
import { useEvents } from "@/hooks/use-events";
import { useExams } from "@/hooks/use-exams";
import { useSubjects } from "@/hooks/use-subjects";

export function UnifiedCalendar() {
  const router = useRouter();
  const { assignments } = useAssignments();
  const { events } = useEvents();
  const { exams } = useExams();
  const { subjectsById } = useSubjects();

  const itemsByDate = React.useMemo(() => {
    const map = new Map<string, CalendarItem[]>();

    function push(date: string | null, item: CalendarItem) {
      if (!date) return;
      const list = map.get(date) ?? [];
      list.push(item);
      map.set(date, list);
    }

    assignments.forEach((a) =>
      push(a.due_date, {
        id: `assignment-${a.id}`,
        label: `📋 ${a.title}`,
        color: a.subject_id ? subjectsById.get(a.subject_id)?.color : "#5B7FFF",
        onClick: () => router.push("/assignments"),
      })
    );
    exams.forEach((e) =>
      push(e.exam_date, {
        id: `exam-${e.id}`,
        label: `🎓 ${e.subject_id ? subjectsById.get(e.subject_id)?.name ?? "Exam" : "Exam"}`,
        color: "#E5484D",
        onClick: () => router.push("/exams"),
      })
    );
    events.forEach((e) =>
      push(e.event_date, {
        id: `event-${e.id}`,
        label: `🎉 ${e.title}`,
        color: "#F5A623",
        onClick: () => router.push("/events"),
      })
    );

    return map;
  }, [assignments, exams, events, subjectsById, router]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs">
        <Badge variant="outline">📋 Assignments</Badge>
        <Badge variant="outline">🎓 Exams</Badge>
        <Badge variant="outline">🎉 Events</Badge>
      </div>
      <MonthCalendar itemsByDate={itemsByDate} />
    </div>
  );
}
