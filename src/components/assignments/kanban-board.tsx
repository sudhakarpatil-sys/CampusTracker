"use client";

import * as React from "react";
import { ASSIGNMENT_STATUSES } from "@/lib/constants";
import { AssignmentCard } from "@/components/assignments/assignment-card";
import type { Assignment, Subject } from "@/types/database.types";
import type { AssignmentInput } from "@/lib/validations/academic";

interface KanbanBoardProps {
  assignments: Assignment[];
  subjects: Subject[];
  subjectsById: Map<string, Subject>;
  onUpdate: (id: string, input: Partial<AssignmentInput>) => Promise<{ error: string | null } | void>;
  onSetStatus: (id: string, status: AssignmentInput["status"]) => void;
  onDuplicate: (assignment: Assignment) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function KanbanBoard({ assignments, subjects, subjectsById, onUpdate, onSetStatus, onDuplicate, onArchive, onDelete }: KanbanBoardProps) {
  const dragId = React.useRef<string | null>(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {ASSIGNMENT_STATUSES.map((column) => {
        const items = assignments.filter((a) => a.status === column.value);
        return (
          <div
            key={column.value}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragId.current) onSetStatus(dragId.current, column.value);
              dragId.current = null;
            }}
            className="flex min-h-[200px] flex-col gap-2 rounded-xl border border-border bg-surface/40 p-3"
          >
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium">{column.label}</p>
              <span className="text-xs text-muted-foreground">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  subject={assignment.subject_id ? subjectsById.get(assignment.subject_id) : undefined}
                  subjects={subjects}
                  draggable
                  onDragStart={() => {
                    dragId.current = assignment.id;
                  }}
                  onUpdate={onUpdate}
                  onDuplicate={onDuplicate}
                  onArchive={onArchive}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
