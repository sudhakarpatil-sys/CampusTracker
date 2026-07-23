"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubjectSelect } from "@/components/shared/subject-select";
import { examSchema, type ExamInput } from "@/lib/validations/academic";
import { PREP_STATUSES } from "@/lib/constants";
import type { Exam, Subject } from "@/types/database.types";

interface ExamFormDialogProps {
  subjects: Subject[];
  exam?: Exam;
  trigger: React.ReactNode;
  onSubmit: (input: ExamInput) => Promise<{ error: string | null } | void>;
}

export function ExamFormDialog({ subjects, exam, trigger, onSubmit }: ExamFormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExamInput>({
    resolver: zodResolver(examSchema),
    defaultValues: exam
      ? {
          subjectId: exam.subject_id ?? undefined,
          examDate: exam.exam_date,
          examTime: exam.exam_time?.slice(0, 5) ?? "",
          venue: exam.venue ?? "",
          syllabus: exam.syllabus ?? "",
          preparationStatus: exam.preparation_status,
        }
      : { preparationStatus: "not_started" },
  });

  async function handleFormSubmit(values: ExamInput) {
    const result = await onSubmit(values);
    if (!result?.error) {
      setOpen(false);
      if (!exam) reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{exam ? "Edit exam" : "Add exam"}</DialogTitle>
          <DialogDescription>Track dates, venue, syllabus, and prep status.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <SubjectSelect subjects={subjects} value={watch("subjectId")} onChange={(v) => setValue("subjectId", v === "none" ? undefined : v)} allowNone />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="examDate">Date</Label>
              <Input id="examDate" type="date" {...register("examDate")} />
              {errors.examDate && <p className="text-xs text-destructive">{errors.examDate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="examTime">Time</Label>
              <Input id="examTime" type="time" {...register("examTime")} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" placeholder="Optional" {...register("venue")} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Preparation status</Label>
              <Select value={watch("preparationStatus")} onValueChange={(v) => setValue("preparationStatus", v as ExamInput["preparationStatus"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PREP_STATUSES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="syllabus">Syllabus</Label>
            <textarea
              id="syllabus"
              rows={3}
              className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Chapters, topics, or units to cover"
              {...register("syllabus")}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {exam ? "Save changes" : "Add exam"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
