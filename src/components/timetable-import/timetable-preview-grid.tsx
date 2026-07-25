"use client";

import { timeToMinutes } from "@/lib/academic";
import type { TimetableImportItem } from "@/types/database.types";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PIXELS_PER_MINUTE = 0.9;

/**
 * Lightweight weekly preview for the review screen — intentionally not a
 * reuse of the full manual TimetableGrid (that one carries drag-and-drop
 * and edit-dialog wiring this preview doesn't need), but matches its
 * visual language: margin-tab accent rule, Fraunces for the subject name,
 * JetBrains Mono for times.
 */
export function TimetablePreviewGrid({ items }: { items: TimetableImportItem[] }) {
  const included = items.filter((i) => i.is_included && i.day_of_week && i.start_time && i.end_time);

  if (included.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">No included lectures to preview yet.</p>;
  }

  const starts = included.map((i) => timeToMinutes(i.start_time!));
  const ends = included.map((i) => timeToMinutes(i.end_time!));
  const gridStart = Math.min(...starts) - 15;
  const gridEnd = Math.max(...ends) + 15;
  const gridHeight = (gridEnd - gridStart) * PIXELS_PER_MINUTE;

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[640px] grid-cols-7 gap-2">
        {DAY_LABELS.map((label, dayIndex) => (
          <div key={label} className="flex flex-col">
            <p className="pb-2 text-center text-xs font-medium text-muted-foreground">{label}</p>
            <div className="relative rounded-lg border border-border bg-surface-raised" style={{ height: gridHeight }}>
              {included
                .filter((item) => item.day_of_week === dayIndex + 1)
                .map((item) => {
                  const start = timeToMinutes(item.start_time!);
                  const end = timeToMinutes(item.end_time!);
                  const top = (start - gridStart) * PIXELS_PER_MINUTE;
                  const height = Math.max((end - start) * PIXELS_PER_MINUTE, 28);
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "margin-tab absolute inset-x-1 overflow-hidden rounded-md bg-accent/15 px-2 py-1",
                        item.conflict_reason && "ring-1 ring-destructive"
                      )}
                      style={{ top, height }}
                    >
                      <p className="truncate font-display text-xs font-semibold">{item.subject_name_raw}</p>
                      <p className="truncate font-mono text-[10px] text-muted-foreground">
                        {item.start_time}–{item.end_time}
                        {item.classroom ? ` · ${item.classroom}` : ""}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
