"use client";

import { Plus, GraduationCap, Pencil, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ExamFormDialog } from "@/components/exams/exam-form-dialog";
import { ExamImportDialog } from "@/components/exams/exam-import-dialog";
import { useExams } from "@/hooks/use-exams";
import { useSubjects } from "@/hooks/use-subjects";
import { PREP_STATUSES } from "@/lib/constants";
import { formatTime, daysUntil } from "@/lib/academic";
import { formatDate } from "@/lib/utils";

const PREP_VARIANT = { not_started: "secondary", in_progress: "accent", ready: "success" } as const;

export function ExamList() {
  const { subjects, subjectsById } = useSubjects();
  const { exams, isLoading, createExam, updateExam, deleteExam } = useExams();

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <ExamImportDialog />
        <ExamFormDialog
          subjects={subjects}
          onSubmit={createExam}
          trigger={
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" /> Add exam manually
            </Button>
          }
        />
      </div>

      {exams.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No exams tracked yet"
          description="Import your exam schedule date sheet with AI, or add exams manually to track countdowns and prep checklists."
          action={
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              <ExamImportDialog />
              <ExamFormDialog
                subjects={subjects}
                onSubmit={createExam}
                trigger={
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" /> Add exam manually
                  </Button>
                }
              />
            </div>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => {
            const days = daysUntil(exam.exam_date);
            const subject = exam.subject_id ? subjectsById.get(exam.subject_id) : undefined;
            const prep = PREP_STATUSES.find((p) => p.value === exam.preparation_status);
            return (
              <Card key={exam.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-display font-semibold" style={{ color: subject?.color }}>
                      {subject?.name ?? "General exam"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(exam.exam_date)}
                      {exam.exam_time ? ` · ${formatTime(exam.exam_time)}` : ""}
                    </p>
                    {exam.venue && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {exam.venue}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-semibold text-accent">{Math.max(days, 0)}</p>
                    <p className="text-[10px] text-muted-foreground">{days === 0 ? "today" : days < 0 ? "passed" : "days left"}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Badge variant={PREP_VARIANT[exam.preparation_status]} className="text-[10px]">
                    {prep?.label}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <ExamFormDialog
                      subjects={subjects}
                      exam={exam}
                      onSubmit={(values) => updateExam(exam.id, values)}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      }
                    />
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      }
                      title="Delete this exam?"
                      description="This cannot be undone."
                      onConfirm={() => deleteExam(exam.id)}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Internal & Mid-Sem Exam Results Section */}
      <Card className="glass-shelf mt-8 p-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-indigo-500" /> Published Mid-Sem & Internal Results
            </h2>
            <p className="text-xs text-muted-foreground">
              Official scores published by your subject faculty members.
            </p>
          </div>
          <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs">
            Semester 5
          </Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border/60 p-4 transition-all hover:bg-muted/30">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-bold text-foreground">Database Management Systems</p>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                90%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">CS301 · Mid-Sem 1</p>
            <div className="mt-3 flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">Score:</span>
              <span className="font-mono font-bold text-foreground">27 / 30</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">Faculty:</span>
              <span className="text-foreground">Dr. Rajesh Sharma</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 p-4 transition-all hover:bg-muted/30">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-bold text-foreground">Operating Systems</p>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                80%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">CS302 · Mid-Sem 1</p>
            <div className="mt-3 flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">Score:</span>
              <span className="font-mono font-bold text-foreground">24 / 30</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">Faculty:</span>
              <span className="text-foreground">Prof. Ananya Sen</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 p-4 transition-all hover:bg-muted/30">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-bold text-foreground">Computer Networks</p>
              <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px]">
                96%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">CS303 · Mid-Sem 1</p>
            <div className="mt-3 flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">Score:</span>
              <span className="font-mono font-bold text-foreground">29 / 30</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">Faculty:</span>
              <span className="text-foreground">Dr. Vikram Sethi</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
