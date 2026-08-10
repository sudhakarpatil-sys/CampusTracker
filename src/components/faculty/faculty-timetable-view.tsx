"use client";

import * as React from "react";
import { Calendar, Clock, MapPin, Info, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTimetable } from "@/hooks/use-timetable";
import { useSubjects } from "@/hooks/use-subjects";
import { formatTime } from "@/lib/academic";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function FacultyTimetableViewContent() {
  const { slots, isLoading } = useTimetable();
  const { subjects } = useSubjects();

  const subjectMap = React.useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Faculty Teaching Schedule
          </h1>
          <p className="text-sm text-muted-foreground">
            Official weekly lecture timetable assigned by institutional scheduling connectors.
          </p>
        </div>
        <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-xs font-mono text-indigo-600 dark:text-indigo-400 gap-1.5 py-1 px-3">
          <Lock className="h-3 w-3" /> Official Schedule (Read-Only)
        </Badge>
      </div>

      {/* Days Grid */}
      <div className="grid gap-4 md:grid-cols-5">
        {DAYS_OF_WEEK.map((day: string, dayIndex: number) => {
          const isoDay = dayIndex + 1; // Mon=1
          const daySlots = slots
            .filter((s) => s.day_of_week === isoDay)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));

          return (
            <Card key={day} className="glass-shelf flex flex-col justify-between overflow-hidden">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <CardTitle className="text-xs font-bold font-mono uppercase tracking-wider text-foreground">
                  {day}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2 flex-1">
                {daySlots.length === 0 ? (
                  <p className="py-8 text-center text-[11px] text-muted-foreground">No lectures scheduled</p>
                ) : (
                  daySlots.map((slot) => {
                    const sub = subjectMap.get(slot.subject_id);
                    return (
                      <div
                        key={slot.id}
                        className="rounded-xl border border-border/60 p-2.5 space-y-1 bg-card/60 transition-all hover:border-violet-500/40"
                      >
                        <div className="flex items-center gap-1.5">
                          <div
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: sub?.color || "#5B7FFF" }}
                          />
                          <p className="font-semibold text-xs text-foreground truncate">
                            {sub?.name || "Class"}
                          </p>
                        </div>

                        <p className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                        </p>

                        {slot.classroom && (
                          <p className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Room: {slot.classroom}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
