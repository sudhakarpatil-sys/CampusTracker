"use client";

import { CheckSquare } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { useTasks } from "@/hooks/use-tasks";

export function TasksWidget(props: { onHide?: () => void; draggableProps?: React.HTMLAttributes<HTMLButtonElement> }) {
  const { pendingTasks, toggleComplete } = useTasks();
  const visible = pendingTasks.slice(0, 5);

  return (
    <WidgetShell title="Tasks" icon={CheckSquare} {...props}>
      {visible.length === 0 ? (
        <EmptyState icon={CheckSquare} title="All caught up" description="No pending tasks." className="py-6" />
      ) : (
        <ul className="space-y-2.5">
          {visible.map((task) => (
            <li key={task.id} className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={task.is_completed}
                onChange={(e) => toggleComplete(task.id, e.target.checked)}
                className="h-4 w-4 shrink-0 rounded border-input"
              />
              <span className="truncate text-sm">{task.title}</span>
            </li>
          ))}
        </ul>
      )}
    </WidgetShell>
  );
}
