"use client";

import { Archive, ArchiveRestore, Copy, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { AssignmentFormDialog } from "@/components/assignments/assignment-form-dialog";
import { formatDate } from "@/lib/utils";
import type { Assignment, Subject } from "@/types/database.types";
import type { AssignmentInput } from "@/lib/validations/academic";

const PRIORITY_VARIANT = { low: "secondary", medium: "accent", high: "destructive" } as const;

interface AssignmentCardProps {
  assignment: Assignment;
  subject?: Subject;
  subjects: Subject[];
  draggable?: boolean;
  onDragStart?: () => void;
  onUpdate: (id: string, input: Partial<AssignmentInput>) => Promise<{ error: string | null } | void>;
  onDuplicate: (assignment: Assignment) => void;
  onArchive: (id: string) => void;
  onRestore?: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AssignmentCard({
  assignment,
  subject,
  subjects,
  draggable,
  onDragStart,
  onUpdate,
  onDuplicate,
  onArchive,
  onRestore,
  onDelete,
}: AssignmentCardProps) {
  return (
    <Card draggable={draggable} onDragStart={onDragStart} className={draggable ? "cursor-grab p-3 active:cursor-grabbing" : "p-3"}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{assignment.title}</p>
          {subject && (
            <p className="mt-0.5 truncate text-xs" style={{ color: subject.color }}>
              {subject.name}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <AssignmentFormDialog
              subjects={subjects}
              assignment={assignment}
              onSubmit={(values) => onUpdate(assignment.id, values)}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              }
            />
            <DropdownMenuItem onClick={() => onDuplicate(assignment)}>
              <Copy className="mr-2 h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            {assignment.is_archived && onRestore ? (
              <DropdownMenuItem onClick={() => onRestore(assignment.id)}>
                <ArchiveRestore className="mr-2 h-4 w-4" /> Restore
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onArchive(assignment.id)}>
                <Archive className="mr-2 h-4 w-4" /> Archive
              </DropdownMenuItem>
            )}
            <ConfirmDialog
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              }
              title={`Delete "${assignment.title}"?`}
              description="This cannot be undone."
              onConfirm={() => onDelete(assignment.id)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge variant={PRIORITY_VARIANT[assignment.priority]} className="text-[10px] capitalize">
          {assignment.priority}
        </Badge>
        {assignment.due_date && (
          <Badge variant="outline" className="text-[10px]">
            Due {formatDate(assignment.due_date, { year: undefined })}
          </Badge>
        )}
      </div>
    </Card>
  );
}
