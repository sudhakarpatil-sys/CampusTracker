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
import { timetableSlotSchema, type TimetableSlotInput } from "@/lib/validations/academic";
import { WEEKDAYS } from "@/lib/constants";
import type { Subject, TimetableSlot } from "@/types/database.types";

interface LectureFormDialogProps {
  subjects: Subject[];
  slot?: TimetableSlot;
  defaultDay?: number;
  trigger: React.ReactNode;
  onSubmit: (input: TimetableSlotInput) => Promise<{ error: string | null } | void>;
}

export function LectureFormDialog({ subjects, slot, defaultDay, trigger, onSubmit }: LectureFormDialogProps) {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TimetableSlotInput>({
    resolver: zodResolver(timetableSlotSchema),
    defaultValues: slot
      ? {
          subjectId: slot.subject_id,
          dayOfWeek: slot.day_of_week,
          startTime: slot.start_time.slice(0, 5),
          endTime: slot.end_time.slice(0, 5),
          facultyName: slot.faculty_name ?? "",
          classroom: slot.classroom ?? "",
        }
      : { dayOfWeek: defaultDay ?? 1, startTime: "09:00", endTime: "10:00" },
  });

  async function handleFormSubmit(values: TimetableSlotInput) {
    const result = await onSubmit(values);
    if (!result?.error) {
      setOpen(false);
      if (!slot) reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{slot ? "Edit lecture" : "Add lecture"}</DialogTitle>
          <DialogDescription>Pick a subject, day, and time slot.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <SubjectSelect subjects={subjects} value={watch("subjectId")} onChange={(v) => setValue("subjectId", v, { shouldValidate: true })} />
            {errors.subjectId && <p className="text-xs text-destructive">{errors.subjectId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Day</Label>
            <Select value={String(watch("dayOfWeek"))} onValueChange={(v) => setValue("dayOfWeek", Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEKDAYS.map((d) => (
                  <SelectItem key={d.value} value={String(d.value)}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startTime">Start time</Label>
              <Input id="startTime" type="time" {...register("startTime")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endTime">End time</Label>
              <Input id="endTime" type="time" {...register("endTime")} />
              {errors.endTime && <p className="text-xs text-destructive">{errors.endTime.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="facultyName">Faculty</Label>
              <Input id="facultyName" placeholder="Optional" {...register("facultyName")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="classroom">Classroom</Label>
              <Input id="classroom" placeholder="Optional" {...register("classroom")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {slot ? "Save changes" : "Add lecture"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
