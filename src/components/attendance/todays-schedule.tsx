"use client";

import * as React from "react";
import { Loader2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTimetable } from "@/hooks/use-timetable";
import { useSubjects } from "@/hooks/use-subjects";
import { useAttendance, type AttendanceStatus } from "@/hooks/use-attendance";
import { todayISODay, formatTime } from "@/lib/academic";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "cancelled", label: "Cancelled" },
] as const;

interface TodaysScheduleProps {
  fallback?: React.ReactNode;
}

/** The "Smart Daily Schedule" — today's lectures pulled straight from the
 * timetable, with one-click attendance. Reused on both the dashboard and
 * the Attendance page per the spec. */
export function TodaysSchedule({ fallback }: TodaysScheduleProps) {
  const { slotsForDay, isLoading: timetableLoading } = useTimetable();
  const { subjectsById, isLoading: subjectsLoading } = useSubjects();
  const { statusFor, markAttendance } = useAttendance();

  // Tracks which (slot, status) button is currently saving, so a click
  // gives instant feedback (spinner + disabled row) and can't be fired
  // twice before the first request resolves — the status itself already
  // flips instantly via optimistic local state in useAttendance, this is
  // just the "in flight" affordance on top of that.
  const [pending, setPending] = React.useState<{ slotId: string; status: AttendanceStatus } | null>(null);

  const today = todayISODay();
  const todaysSlots = slotsForDay(today);

  if (timetableLoading || subjectsLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (todaysSlots.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
          <PartyPopper className="h-6 w-6 text-accent" />
          <p className="text-sm font-medium">No classes scheduled today 🎉</p>
        </div>
        {fallback}
      </div>
    );
  }

  async function handleMark(subjectId: string, slotId: string, status: AttendanceStatus) {
    if (pending) return; // one save at a time is plenty for a single-user click
    setPending({ slotId, status });
    await markAttendance({ subjectId, timetableSlotId: slotId, status });
    setPending(null);
  }

  return (
    <div className="space-y-3">
      {todaysSlots.map((slot) => {
        const subject = subjectsById.get(slot.subject_id);
        const currentStatus = statusFor(slot.id);
        const isRowPending = pending?.slotId === slot.id;
        return (
          <div key={slot.id} className="margin-tab flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-xs text-muted-foreground">
                {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
              </p>
              <p className="truncate font-medium" style={{ color: subject?.color }}>
                {subject?.name ?? "Unknown subject"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {[slot.classroom, slot.faculty_name].filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="flex gap-1.5">
              {STATUS_OPTIONS.map((opt) => {
                const isThisButtonPending = isRowPending && pending?.status === opt.value;
                return (
                  <Button
                    key={opt.value}
                    size="sm"
                    variant={currentStatus === opt.value ? "default" : "outline"}
                    className={cn(
                      "text-xs",
                      currentStatus === opt.value && opt.value === "present" && "bg-success text-white hover:bg-success/90",
                      currentStatus === opt.value && opt.value === "absent" && "bg-destructive hover:bg-destructive/90"
                    )}
                    disabled={isRowPending}
                    onClick={() => handleMark(slot.subject_id, slot.id, opt.value)}
                  >
                    {isThisButtonPending && <Loader2 className="h-3 w-3 animate-spin" />}
                    {opt.label}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
