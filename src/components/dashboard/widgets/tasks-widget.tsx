"use client";

import { motion } from "framer-motion";
import { CheckSquare, CheckCircle2, Circle } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { useTasks } from "@/hooks/use-tasks";
import { cn } from "@/lib/utils";

export function TasksWidget(props: { onHide?: () => void; draggableProps?: React.HTMLAttributes<HTMLButtonElement> }) {
  const { pendingTasks, toggleComplete } = useTasks();
  const visible = pendingTasks.slice(0, 4);

  return (
    <WidgetShell title="Tasks" icon={CheckSquare} {...props}>
      {visible.length === 0 ? (
        <EmptyState icon={CheckSquare} title="All caught up" description="No pending tasks." className="py-6" />
      ) : (
        <div className="space-y-2">
          {visible.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-2.5 transition-colors hover:bg-muted/40"
            >
              <button
                type="button"
                onClick={() => toggleComplete(task.id, !task.is_completed)}
                className="flex shrink-0 items-center justify-center text-muted-foreground hover:text-emerald-500 transition-colors"
                aria-label={`Toggle task ${task.title}`}
              >
                {task.is_completed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </button>

              <span className={cn("truncate text-xs font-medium text-foreground", task.is_completed && "line-through text-muted-foreground")}>
                {task.title}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </WidgetShell>
  );
}
