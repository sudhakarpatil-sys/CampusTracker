"use client";

import { Plus, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AssignmentFormDialog } from "@/components/assignments/assignment-form-dialog";
import { KanbanBoard } from "@/components/assignments/kanban-board";
import { AssignmentListView } from "@/components/assignments/list-view";
import { AssignmentCalendarView } from "@/components/assignments/calendar-view";
import { useAssignments } from "@/hooks/use-assignments";
import { useSubjects } from "@/hooks/use-subjects";

export function AssignmentsView() {
  const { subjects, subjectsById } = useSubjects();
  const {
    assignments,
    archivedAssignments,
    isLoading,
    createAssignment,
    updateAssignment,
    setStatus,
    duplicateAssignment,
    archiveAssignment,
    restoreAssignment,
    deleteAssignment,
  } = useAssignments({ includeArchived: true });

  const activeAssignments = assignments.filter((a) => !a.is_archived);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue="kanban">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="archived">
            <Archive className="mr-1.5 h-3.5 w-3.5" /> Archived ({archivedAssignments.length})
          </TabsTrigger>
        </TabsList>
        <AssignmentFormDialog
          subjects={subjects}
          onSubmit={createAssignment}
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4" /> New assignment
            </Button>
          }
        />
      </div>

      <TabsContent value="kanban">
        <KanbanBoard
          assignments={activeAssignments}
          subjects={subjects}
          subjectsById={subjectsById}
          onUpdate={updateAssignment}
          onSetStatus={setStatus}
          onDuplicate={duplicateAssignment}
          onArchive={archiveAssignment}
          onDelete={deleteAssignment}
        />
      </TabsContent>

      <TabsContent value="list">
        <AssignmentListView
          assignments={activeAssignments}
          subjects={subjects}
          subjectsById={subjectsById}
          onUpdate={updateAssignment}
          onDuplicate={duplicateAssignment}
          onArchive={archiveAssignment}
          onDelete={deleteAssignment}
        />
      </TabsContent>

      <TabsContent value="calendar">
        <AssignmentCalendarView assignments={activeAssignments} subjectsById={subjectsById} />
      </TabsContent>

      <TabsContent value="archived">
        <AssignmentListView
          assignments={archivedAssignments}
          subjects={subjects}
          subjectsById={subjectsById}
          onUpdate={updateAssignment}
          onDuplicate={duplicateAssignment}
          onArchive={archiveAssignment}
          onRestore={restoreAssignment}
          onDelete={deleteAssignment}
        />
      </TabsContent>
    </Tabs>
  );
}
