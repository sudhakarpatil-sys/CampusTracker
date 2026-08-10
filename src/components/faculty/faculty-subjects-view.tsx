"use client";

import * as React from "react";
import { BookOpen, MapPin, Award, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useFaculty } from "@/hooks/use-faculty";
import { cn } from "@/lib/utils";

export function FacultySubjectsViewContent() {
  const { assignedSubjects, isLoading } = useFaculty();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My Assigned Subjects
        </h1>
        <p className="text-sm text-muted-foreground">
          Institutional course allocations, lecture halls, and credit values assigned to your profile.
        </p>
      </div>

      {/* Grid */}
      {assignedSubjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects allocated"
          description="Assigned courses will automatically appear based on timetable import schedules."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assignedSubjects.map((subject) => (
            <Card key={subject.id} className="glass-shelf flex flex-col justify-between overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-3.5 w-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: subject.color || "#5B7FFF" }}
                    />
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{subject.name}</h3>
                      <p className="text-[11px] font-mono text-muted-foreground">{subject.code || "CS-301"}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {subject.credits || 4} Credits
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-4 text-xs">
                <div className="rounded-xl border border-border/50 bg-muted/20 p-2.5 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Classroom:</span>
                    <span className="text-foreground font-medium">{subject.classroom || "Auditorium 2"}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1"><Award className="h-3 w-3" /> Target Attendance:</span>
                    <span className="text-foreground font-medium">{subject.attendance_target || 75}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
