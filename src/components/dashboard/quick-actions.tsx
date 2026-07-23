"use client";

import { BookOpen, CalendarClock, ListChecks, PartyPopper, CheckSquare, NotebookText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubjectFormDialog } from "@/components/subjects/subject-form-dialog";
import { LectureFormDialog } from "@/components/timetable/lecture-form-dialog";
import { AssignmentFormDialog } from "@/components/assignments/assignment-form-dialog";
import { EventFormDialog } from "@/components/events/event-form-dialog";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { useSubjects } from "@/hooks/use-subjects";
import { useTimetable } from "@/hooks/use-timetable";
import { useAssignments } from "@/hooks/use-assignments";
import { useEvents } from "@/hooks/use-events";
import { useTasks } from "@/hooks/use-tasks";
import { useNotes } from "@/hooks/use-notes";

/** "Quick Actions" — create any core entity without leaving the dashboard. */
export function QuickActions() {
  const router = useRouter();
  const { subjects, createSubject } = useSubjects();
  const { createSlot } = useTimetable();
  const { createAssignment } = useAssignments();
  const { createEvent } = useEvents();
  const { createTask } = useTasks();
  const { createNote } = useNotes();

  async function handleQuickNote() {
    const { id } = await createNote({ title: "Untitled note" });
    if (id) router.push(`/notes/${id}`);
  }

  return (
    <Card className="p-4">
      <p className="margin-tab mb-3 text-sm font-medium text-muted-foreground">Quick actions</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <SubjectFormDialog
          onSubmit={createSubject}
          trigger={
            <Button variant="outline" size="sm" className="w-full flex-col gap-1.5 py-4">
              <BookOpen className="h-4 w-4" /> Subject
            </Button>
          }
        />
        <LectureFormDialog
          subjects={subjects}
          onSubmit={createSlot}
          trigger={
            <Button variant="outline" size="sm" className="w-full flex-col gap-1.5 py-4">
              <CalendarClock className="h-4 w-4" /> Lecture
            </Button>
          }
        />
        <AssignmentFormDialog
          subjects={subjects}
          onSubmit={createAssignment}
          trigger={
            <Button variant="outline" size="sm" className="w-full flex-col gap-1.5 py-4">
              <ListChecks className="h-4 w-4" /> Assignment
            </Button>
          }
        />
        <EventFormDialog
          onSubmit={createEvent}
          trigger={
            <Button variant="outline" size="sm" className="w-full flex-col gap-1.5 py-4">
              <PartyPopper className="h-4 w-4" /> Event
            </Button>
          }
        />
        <TaskFormDialog
          onSubmit={createTask}
          trigger={
            <Button variant="outline" size="sm" className="w-full flex-col gap-1.5 py-4">
              <CheckSquare className="h-4 w-4" /> Task
            </Button>
          }
        />
        <Button variant="outline" size="sm" className="w-full flex-col gap-1.5 py-4" onClick={handleQuickNote}>
          <NotebookText className="h-4 w-4" /> Note
        </Button>
      </div>
    </Card>
  );
}
