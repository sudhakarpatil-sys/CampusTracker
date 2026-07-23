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
import { ColorPicker } from "@/components/shared/color-picker";
import { subjectSchema, type SubjectInput } from "@/lib/validations/academic";
import { SUBJECT_COLORS } from "@/lib/constants";
import type { Subject } from "@/types/database.types";

interface SubjectFormDialogProps {
  subject?: Subject;
  trigger: React.ReactNode;
  onSubmit: (input: SubjectInput) => Promise<{ error: string | null } | void>;
}

export function SubjectFormDialog({ subject, trigger, onSubmit }: SubjectFormDialogProps) {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectInput>({
    resolver: zodResolver(subjectSchema),
    defaultValues: subject
      ? {
          name: subject.name,
          code: subject.code ?? "",
          facultyName: subject.faculty_name ?? "",
          classroom: subject.classroom ?? "",
          credits: subject.credits ?? undefined,
          attendanceTarget: subject.attendance_target,
          color: subject.color,
        }
      : { attendanceTarget: 75, color: SUBJECT_COLORS[0] },
  });

  async function handleFormSubmit(values: SubjectInput) {
    const result = await onSubmit(values);
    if (!result?.error) {
      setOpen(false);
      if (!subject) reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{subject ? "Edit subject" : "Add subject"}</DialogTitle>
          <DialogDescription>Subjects power your timetable, attendance, and assignments.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="name">Subject name</Label>
              <Input id="name" placeholder="Operating Systems" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="code">Subject code</Label>
              <Input id="code" placeholder="CS301" {...register("code")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="credits">Credits</Label>
              <Input id="credits" type="number" step="0.5" placeholder="4" {...register("credits")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="facultyName">Faculty name</Label>
              <Input id="facultyName" placeholder="Dr. Rao" {...register("facultyName")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="classroom">Classroom</Label>
              <Input id="classroom" placeholder="Room 304" {...register("classroom")} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="attendanceTarget">Attendance target (%)</Label>
              <Input id="attendanceTarget" type="number" min={0} max={100} {...register("attendanceTarget")} />
              {errors.attendanceTarget && <p className="text-xs text-destructive">{errors.attendanceTarget.message}</p>}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Color</Label>
              <ColorPicker value={watch("color")} onChange={(c) => setValue("color", c)} />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {subject ? "Save changes" : "Add subject"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
