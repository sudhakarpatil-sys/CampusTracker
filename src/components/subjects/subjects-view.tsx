"use client";

import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { SubjectFormDialog } from "@/components/subjects/subject-form-dialog";
import { SubjectCard } from "@/components/subjects/subject-card";
import { useSubjects } from "@/hooks/use-subjects";
import { useAttendance } from "@/hooks/use-attendance";

export function SubjectsView() {
  const { subjects, archivedSubjects, isLoading, createSubject, updateSubject, archiveSubject, restoreSubject, deleteSubject } =
    useSubjects({ includeArchived: true });
  const { statsBySubject } = useAttendance();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue="active">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="active">Active ({subjects.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedSubjects.length})</TabsTrigger>
        </TabsList>
        <SubjectFormDialog
          onSubmit={createSubject}
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4" /> Add subject
            </Button>
          }
        />
      </div>

      <TabsContent value="active">
        {subjects.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No subjects yet"
            description="Add your first subject to start building a timetable and tracking attendance."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                stats={statsBySubject.get(subject.id)}
                onUpdate={updateSubject}
                onArchive={archiveSubject}
                onRestore={restoreSubject}
                onDelete={deleteSubject}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="archived">
        {archivedSubjects.length === 0 ? (
          <EmptyState icon={BookOpen} title="No archived subjects" description="Archived subjects will show up here." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archivedSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                stats={statsBySubject.get(subject.id)}
                onUpdate={updateSubject}
                onArchive={archiveSubject}
                onRestore={restoreSubject}
                onDelete={deleteSubject}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
