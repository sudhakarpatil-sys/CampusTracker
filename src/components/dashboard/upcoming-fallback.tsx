"use client";

import { useAssignments } from "@/hooks/use-assignments";
import { useEvents } from "@/hooks/use-events";
import { useTasks } from "@/hooks/use-tasks";
import { formatDate } from "@/lib/utils";

/** Shown inside the "Today's schedule" widget/section when there are no
 * lectures today — surfaces what's actually next instead of empty space. */
export function UpcomingFallback() {
  const { assignments } = useAssignments();
  const { events } = useEvents();
  const { pendingTasks } = useTasks();

  const nextAssignments = assignments.filter((a) => a.status !== "completed").slice(0, 3);
  const nextEvents = events.slice(0, 3);
  const nextTasks = pendingTasks.slice(0, 3);

  if (nextAssignments.length === 0 && nextEvents.length === 0 && nextTasks.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Upcoming assignments</p>
        <div className="space-y-1.5">
          {nextAssignments.length === 0 && <p className="text-xs text-muted-foreground">Nothing due.</p>}
          {nextAssignments.map((a) => (
            <p key={a.id} className="truncate text-sm">
              {a.title}
              {a.due_date && <span className="text-muted-foreground"> · {formatDate(a.due_date)}</span>}
            </p>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Upcoming events</p>
        <div className="space-y-1.5">
          {nextEvents.length === 0 && <p className="text-xs text-muted-foreground">Nothing scheduled.</p>}
          {nextEvents.map((e) => (
            <p key={e.id} className="truncate text-sm">
              {e.title} <span className="text-muted-foreground">· {formatDate(e.event_date)}</span>
            </p>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Tasks</p>
        <div className="space-y-1.5">
          {nextTasks.length === 0 && <p className="text-xs text-muted-foreground">All caught up.</p>}
          {nextTasks.map((t) => (
            <p key={t.id} className="truncate text-sm">
              {t.title}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
