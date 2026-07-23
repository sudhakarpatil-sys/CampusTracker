"use client";

import { Plus, Trash2, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { useTasks } from "@/hooks/use-tasks";
import { formatDate, cn } from "@/lib/utils";

const PRIORITY_VARIANT = { low: "secondary", medium: "accent", high: "destructive" } as const;

export function TaskList() {
  const { pendingTasks, completedTasks, isLoading, createTask, toggleComplete, deleteTask } = useTasks();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <TaskFormDialog
          onSubmit={createTask}
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4" /> New task
            </Button>
          }
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">To do ({pendingTasks.length})</p>
        {pendingTasks.length === 0 ? (
          <EmptyState icon={CheckSquare} title="Nothing pending" description="Add a task to get started." />
        ) : (
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <Card key={task.id} className="flex items-center gap-3 p-3">
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={(e) => toggleComplete(task.id, e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.title}</p>
                  {task.due_date && <p className="text-xs text-muted-foreground">Due {formatDate(task.due_date)}</p>}
                </div>
                <Badge variant={PRIORITY_VARIANT[task.priority]} className="text-[10px] capitalize">
                  {task.priority}
                </Badge>
                <button onClick={() => deleteTask(task.id)} aria-label="Delete task">
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">Completed ({completedTasks.length})</p>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <Card key={task.id} className="flex items-center gap-3 p-3 opacity-60">
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={(e) => toggleComplete(task.id, e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <p className={cn("flex-1 text-sm line-through")}>{task.title}</p>
                <button onClick={() => deleteTask(task.id)} aria-label="Delete task">
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
