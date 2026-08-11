"use client";

import * as React from "react";
import { PartyPopper, MapPin, UserCheck, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTimetable } from "@/hooks/use-timetable";
import { useSubjects } from "@/hooks/use-subjects";
import { useAttendance } from "@/hooks/use-attendance";
import { todayISODay, formatTime } from "@/lib/academic";

interface TodaysScheduleProps {
  fallback?: React.ReactNode;
}

export function TodaysSchedule({ fallback }: TodaysScheduleProps) {
  const { slotsForDay, isLoading: timetableLoading } = useTimetable();
  const { subjectsById, isLoading: subjectsLoading } = useSubjects();
  const { statusFor } = useAttendance();

  const today = todayISODay();
  const todaysSlots = slotsForDay(today);

  if (timetableLoading || subjectsLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (todaysSlots.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-border/80 bg-muted/20 py-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <PartyPopper className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-foreground">No classes scheduled today 🎉</p>
          <p className="text-[11px] text-muted-foreground">Enjoy your free day or prepare ahead!</p>
        </div>
        {fallback}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todaysSlots.map((slot) => {
        const subject = subjectsById.get(slot.subject_id);
        const currentStatus = statusFor(slot.id);
        const subjectColor = subject?.color || "#6366F1";

        return (
          <div
            key={slot.id}
            className="group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-3.5 transition-all hover:border-indigo-500/30 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderLeftWidth: "4px", borderLeftColor: subjectColor }}
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-mono text-[11px] font-medium text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                </span>
              </div>
              <p className="truncate text-sm font-semibold text-foreground">
                {subject?.name ?? "Unknown subject"}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                {slot.classroom && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {slot.classroom}
                  </span>
                )}
                {slot.faculty_name && (
                  <span className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3" /> {slot.faculty_name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentStatus === "present" && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Official: Present
                </span>
              )}
              {currentStatus === "absent" && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  Official: Absent
                </span>
              )}
              {currentStatus === "cancelled" && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-slate-500/30 bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-400">
                  Cancelled
                </span>
              )}
              {!currentStatus && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400">
                  Scheduled (ERP Sync Pending)
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
