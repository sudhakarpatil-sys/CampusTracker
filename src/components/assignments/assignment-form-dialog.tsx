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
import { assignmentSchema, type AssignmentInput } from "@/lib/validations/academic";
import { PRIORITIES, ASSIGNMENT_STATUSES } from "@/lib/constants";
import type { Assignment, Subject } from "@/types/database.types";

interface AssignmentFormDialogProps {
  subjects: Subject[];
  assignment?: Assignment;
  trigger: React.ReactNode;
  onSubmit: (input: AssignmentInput) => Promise<{ error: string | null } | void>;
}

export function AssignmentFormDialog({ subjects, assignment, trigger, onSubmit }: AssignmentFormDialogProps) {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentInput>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: assignment
      ? {
          title: assignment.title,
          subjectId: assignment.subject_id ?? undefined,
          description: assignment.description ?? "",
          dueDate: assignment.due_date ?? "",
          dueTime: assignment.due_time?.slice(0, 5) ?? "",
          priority: assignment.priority,
          status: assignment.status,
          notes: assignment.notes ?? "",
        }
      : { priority: "medium", status: "not_started" },
  });

  async function handleFormSubmit(values: AssignmentInput) {
    const result = await onSubmit(values);
    if (!result?.error) {
      setOpen(false);
      if (!assignment) reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{assignment ? "Edit assignment" : "New assignment"}</DialogTitle>
          <DialogDescription>Keep every deadline in one place.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Thermodynamics problem set" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Subject</Label>
            <SubjectSelect
              subjects={subjects}
              value={watch("subjectId")}
              onChange={(v) => setValue("subjectId", v === "none" ? undefined : v)}
              allowNone
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Optional details"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" type="date" {...register("dueDate")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dueTime">Due time</Label>
              <Input id="dueTime" type="time" {...register("dueTime")} />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={watch("priority")} onValueChange={(v) => setValue("priority", v as AssignmentInput["priority"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={watch("status")} onValueChange={(v) => setValue("status", v as AssignmentInput["status"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNMENT_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              rows={2}
              className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Optional"
              {...register("notes")}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {assignment ? "Save changes" : "Create assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
