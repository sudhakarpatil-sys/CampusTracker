"use client";

import * as React from "react";
import { Plus, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { LectureFormDialog } from "@/components/timetable/lecture-form-dialog";
import { LectureBlock } from "@/components/timetable/lecture-block";
import { WeekendToggle } from "@/components/timetable/weekend-toggle";
import { useTimetable } from "@/hooks/use-timetable";
import { useSubjects } from "@/hooks/use-subjects";
import { useTimetableSettings } from "@/hooks/use-timetable-settings";
import { WEEKDAYS, TIMETABLE_HOURS } from "@/lib/constants";
import { timeToMinutes, minutesToTime } from "@/lib/academic";
import { cn } from "@/lib/utils";

const PX_PER_MIN = 1;
const GRID_START_MIN = TIMETABLE_HOURS.start * 60;
const GRID_END_MIN = TIMETABLE_HOURS.end * 60;
const GRID_HEIGHT = (GRID_END_MIN - GRID_START_MIN) * PX_PER_MIN;

export function TimetableGrid() {
  const { subjects, isLoading: subjectsLoading } = useSubjects();
  const { slots, isLoading, createSlot, updateSlot, duplicateSlot, deleteSlot, slotsForDay } = useTimetable();
  const { settings } = useTimetableSettings();
  const dragSlotId = React.useRef<string | null>(null);
  const columnRefs = React.useRef<Record<number, HTMLDivElement | null>>({});

  const days = settings.showWeekends ? WEEKDAYS : WEEKDAYS.filter((d) => d.value <= 5);

  function handleDrop(e: React.DragEvent<HTMLDivElement>, day: number) {
    e.preventDefault();
    const slotId = dragSlotId.current;
    const slot = slots.find((s) => s.id === slotId);
    const column = columnRefs.current[day];
    if (!slot || !column) return;

    const rect = column.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const rawMinutes = GRID_START_MIN + offsetY / PX_PER_MIN;
    const snapped = Math.round(rawMinutes / 15) * 15;
    const duration = timeToMinutes(slot.end_time) - timeToMinutes(slot.start_time);
    const newStart = Math.max(GRID_START_MIN, Math.min(snapped, GRID_END_MIN - duration));

    updateSlot(slot.id, {
      dayOfWeek: day,
      startTime: minutesToTime(newStart),
      endTime: minutesToTime(newStart + duration),
    });
    dragSlotId.current = null;
  }

  if (isLoading || subjectsLoading) {
    return <Skeleton className="h-[600px] w-full rounded-xl" />;
  }

  if (subjects.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="Add a subject first"
        description="Your timetable is built from subjects — add one, then come back to schedule lectures."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Drag a lecture to move it — or use the edit button for precise timing.</p>
        <WeekendToggle />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <div className="flex min-w-[720px]">
          <div className="w-14 shrink-0 border-r border-border/60 pt-10">
            {Array.from({ length: TIMETABLE_HOURS.end - TIMETABLE_HOURS.start }).map((_, i) => (
              <div key={i} style={{ height: 60 * PX_PER_MIN }} className="border-t border-border/40 pr-2 text-right text-[10px] text-muted-foreground">
                {((TIMETABLE_HOURS.start + i - 1) % 12) + 1} {TIMETABLE_HOURS.start + i < 12 ? "AM" : "PM"}
              </div>
            ))}
          </div>

          {days.map((day) => (
            <div key={day.value} className="flex-1 border-r border-border/60 last:border-r-0">
              <div className="flex h-10 items-center justify-center gap-1.5 border-b border-border/60 text-sm font-medium">
                {day.short}
                <LectureFormDialog
                  subjects={subjects}
                  defaultDay={day.value}
                  onSubmit={createSlot}
                  trigger={
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground">
                      <Plus className="h-3 w-3" />
                    </Button>
                  }
                />
              </div>
              <div
                ref={(el) => {
                  columnRefs.current[day.value] = el;
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, day.value)}
                className={cn("relative")}
                style={{ height: GRID_HEIGHT }}
              >
                {Array.from({ length: TIMETABLE_HOURS.end - TIMETABLE_HOURS.start }).map((_, i) => (
                  <div key={i} className="absolute inset-x-0 border-t border-border/30" style={{ top: i * 60 * PX_PER_MIN }} />
                ))}

                {slotsForDay(day.value).map((slot) => {
                  const top = (timeToMinutes(slot.start_time) - GRID_START_MIN) * PX_PER_MIN;
                  const height = (timeToMinutes(slot.end_time) - timeToMinutes(slot.start_time)) * PX_PER_MIN;
                  const subject = subjects.find((s) => s.id === slot.subject_id);
                  return (
                    <LectureBlock
                      key={slot.id}
                      slot={slot}
                      subject={subject}
                      subjects={subjects}
                      top={top}
                      height={height}
                      onUpdate={updateSlot}
                      onDuplicate={duplicateSlot}
                      onDelete={deleteSlot}
                      draggable
                      onDragStart={() => {
                        dragSlotId.current = slot.id;
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
