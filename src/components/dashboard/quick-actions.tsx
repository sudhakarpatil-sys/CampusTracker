"use client";

import { motion } from "framer-motion";
import { BookOpen, CalendarClock, ListChecks, PartyPopper, CheckSquare, NotebookText, Plus } from "lucide-react";
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

  const actions = [
    {
      label: "Subject",
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white",
      dialog: (trigger: React.ReactNode) => <SubjectFormDialog onSubmit={createSubject} trigger={trigger} />,
    },
    {
      label: "Lecture",
      icon: CalendarClock,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white",
      dialog: (trigger: React.ReactNode) => <LectureFormDialog subjects={subjects} onSubmit={createSlot} trigger={trigger} />,
    },
    {
      label: "Assignment",
      icon: ListChecks,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white",
      dialog: (trigger: React.ReactNode) => <AssignmentFormDialog subjects={subjects} onSubmit={createAssignment} trigger={trigger} />,
    },
    {
      label: "Event",
      icon: PartyPopper,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white",
      dialog: (trigger: React.ReactNode) => <EventFormDialog onSubmit={createEvent} trigger={trigger} />,
    },
    {
      label: "Task",
      icon: CheckSquare,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
      dialog: (trigger: React.ReactNode) => <TaskFormDialog onSubmit={createTask} trigger={trigger} />,
    },
  ];

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Plus className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">Quick Actions</span>
        </div>
        <span className="text-xs text-muted-foreground">Add new item instantly</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {actions.map((act) => {
          const Icon = act.icon;
          const buttonContent = (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="group flex h-auto w-full flex-col items-center justify-center gap-2 rounded-xl border-border/70 py-3.5 transition-all duration-200 hover:border-indigo-500/30 hover:shadow-md"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 ${act.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-foreground">{act.label}</span>
              </Button>
            </motion.div>
          );
          return <span key={act.label}>{act.dialog(buttonContent)}</span>;
        })}

        {/* Note Action */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="group flex h-auto w-full flex-col items-center justify-center gap-2 rounded-xl border-border/70 py-3.5 transition-all duration-200 hover:border-indigo-500/30 hover:shadow-md"
            onClick={handleQuickNote}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 transition-colors duration-200 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white">
              <NotebookText className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-foreground">Note</span>
          </Button>
        </motion.div>
      </div>
    </Card>
  );
}
