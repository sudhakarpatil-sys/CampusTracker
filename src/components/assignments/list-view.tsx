"use client";

import { AssignmentCard } from "@/components/assignments/assignment-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ListChecks } from "lucide-react";
import type { Assignment, Subject } from "@/types/database.types";
import type { AssignmentInput } from "@/lib/validations/academic";

interface ListViewProps {
  assignments: Assignment[];
  subjects: Subject[];
  subjectsById: Map<string, Subject>;
  onUpdate: (id: string, input: Partial<AssignmentInput>) => Promise<{ error: string | null } | void>;
  onDuplicate: (assignment: Assignment) => void;
  onArchive: (id: string) => void;
  onRestore?: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AssignmentListView({ assignments, subjects, subjectsById, onUpdate, onDuplicate, onArchive, onRestore, onDelete }: ListViewProps) {
  if (assignments.length === 0) {
    return <EmptyState icon={ListChecks} title="No assignments yet" description="Create your first assignment to start tracking deadlines." />;
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          subject={assignment.subject_id ? subjectsById.get(assignment.subject_id) : undefined}
          subjects={subjects}
          onUpdate={onUpdate}
          onDuplicate={onDuplicate}
          onArchive={onArchive}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
