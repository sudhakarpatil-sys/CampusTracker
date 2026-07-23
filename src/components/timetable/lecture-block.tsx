"use client";

import { Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { LectureFormDialog } from "@/components/timetable/lecture-form-dialog";
import { formatTime } from "@/lib/academic";
import { cn } from "@/lib/utils";
import type { Subject, TimetableSlot } from "@/types/database.types";
import type { TimetableSlotInput } from "@/lib/validations/academic";

interface LectureBlockProps {
  slot: TimetableSlot;
  subject?: Subject;
  subjects: Subject[];
  top: number;
  height: number;
  onUpdate: (id: string, input: Partial<TimetableSlotInput>) => Promise<{ error: string | null } | void>;
  onDuplicate: (slot: TimetableSlot) => void;
  onDelete: (id: string) => void;
  draggable?: boolean;
  onDragStart?: () => void;
}

export function LectureBlock({ slot, subject, subjects, top, height, onUpdate, onDuplicate, onDelete, draggable, onDragStart }: LectureBlockProps) {
  const compact = height < 56;

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className={cn(
        "group absolute inset-x-1 overflow-hidden rounded-lg border p-2 text-left shadow-sm transition-shadow hover:shadow-md",
        draggable && "cursor-grab active:cursor-grabbing"
      )}
      style={{
        top,
        height: Math.max(height, 32),
        backgroundColor: `${subject?.color ?? "#5B7FFF"}1a`,
        borderColor: `${subject?.color ?? "#5B7FFF"}55`,
      }}
    >
      <div className="flex h-full flex-col">
        <p className="truncate text-xs font-semibold" style={{ color: subject?.color }}>
          {subject?.name ?? "Unknown subject"}
        </p>
        {!compact && (
          <>
            <p className="truncate text-[11px] text-muted-foreground">
              {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
            </p>
            {(slot.classroom || slot.faculty_name) && (
              <p className="truncate text-[11px] text-muted-foreground">
                {[slot.classroom, slot.faculty_name].filter(Boolean).join(" · ")}
              </p>
            )}
          </>
        )}
      </div>

      <div className="absolute right-1 top-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <LectureFormDialog
          subjects={subjects}
          slot={slot}
          onSubmit={(values) => onUpdate(slot.id, values)}
          trigger={
            <Button variant="secondary" size="icon" className="h-6 w-6 bg-surface/80">
              <span className="sr-only">Edit</span>
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" strokeLinecap="round" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          }
        />
        <Button variant="secondary" size="icon" className="h-6 w-6 bg-surface/80" onClick={() => onDuplicate(slot)}>
          <Copy className="h-3 w-3" />
        </Button>
        <ConfirmDialog
          trigger={
            <Button variant="secondary" size="icon" className="h-6 w-6 bg-surface/80 hover:text-destructive">
              <Trash2 className="h-3 w-3" />
            </Button>
          }
          title="Remove this lecture?"
          description="This removes it from your timetable. Past attendance records are kept."
          onConfirm={() => onDelete(slot.id)}
        />
      </div>
    </div>
  );
}
