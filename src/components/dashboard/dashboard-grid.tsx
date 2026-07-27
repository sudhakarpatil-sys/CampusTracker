"use client";

import * as React from "react";
import { RotateCcw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useWidgets, type WidgetId } from "@/hooks/use-widgets";
import { Skeleton } from "@/components/ui/skeleton";
import { TodaysScheduleWidget } from "@/components/dashboard/widgets/todays-schedule-widget";
import { AttendanceWidget } from "@/components/dashboard/widgets/attendance-widget";
import { AssignmentsWidget } from "@/components/dashboard/widgets/assignments-widget";
import { EventsWidget } from "@/components/dashboard/widgets/events-widget";
import { TasksWidget } from "@/components/dashboard/widgets/tasks-widget";
import { NotesWidget } from "@/components/dashboard/widgets/notes-widget";

const WIDGET_MAP: Record<WidgetId, { label: string; Component: React.ComponentType<{ onHide?: () => void; draggableProps?: React.HTMLAttributes<HTMLButtonElement> }> }> = {
  "todays-schedule": { label: "Today's schedule", Component: TodaysScheduleWidget },
  attendance: { label: "Overall attendance", Component: AttendanceWidget },
  assignments: { label: "Upcoming assignments", Component: AssignmentsWidget },
  events: { label: "Upcoming events", Component: EventsWidget },
  tasks: { label: "Tasks", Component: TasksWidget },
  notes: { label: "Recent notes", Component: NotesWidget },
};

export function DashboardGrid() {
  const { order, hidden, isReady, moveWidget, toggleHidden, resetLayout } = useWidgets();
  const dragIndex = React.useRef<number | null>(null);

  const visibleOrder = order.filter((id) => !hidden.includes(id));

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDrop(index: number) {
    if (dragIndex.current === null || dragIndex.current === index) return;
    moveWidget(dragIndex.current, index);
    dragIndex.current = null;
  }

  if (!isReady) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-3.5 w-3.5" /> Widgets
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {order.map((id) => (
              <DropdownMenuCheckboxItem
                key={id}
                checked={!hidden.includes(id)}
                onCheckedChange={() => toggleHidden(id)}
                onSelect={(e) => e.preventDefault()}
              >
                {WIDGET_MAP[id].label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="sm" onClick={resetLayout}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset layout
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleOrder.map((id) => {
          const { Component } = WIDGET_MAP[id];
          const realIndex = order.indexOf(id);
          return (
            <div
              key={id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(realIndex)}
              className="animate-fade-up transition-transform duration-300 hover:-translate-y-0.5"
              style={{ animationDelay: `${realIndex * 60}ms` }}
            >
              <Component
                onHide={() => toggleHidden(id)}
                draggableProps={{
                  draggable: true,
                  onDragStart: () => handleDragStart(realIndex),
                }}
              />
            </div>
          );
        })}
      </div>

      {visibleOrder.length === 0 && (
        <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          All widgets are hidden. Use the Widgets menu above to bring them back.
        </p>
      )}
    </div>
  );
}
