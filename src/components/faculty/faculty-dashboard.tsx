"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  FileSpreadsheet,
  Megaphone,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useFaculty } from "@/hooks/use-faculty";
import { useNotes } from "@/hooks/use-notes";
import { useAssignments } from "@/hooks/use-assignments";
import { useAnnouncements } from "@/hooks/use-announcements";
import { cn, formatDate } from "@/lib/utils";

export function FacultyDashboardContent() {
  const { profile, assignedSubjects, isLoading: isFacultyLoading } = useFaculty();
  const { notes, isLoading: isNotesLoading } = useNotes();
  const { assignments, isLoading: isAssignmentsLoading } = useAssignments();
  const { announcements, isLoading: isAnnouncementsLoading } = useAnnouncements();

  const isLoading = isFacultyLoading || isNotesLoading || isAssignmentsLoading || isAnnouncementsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {profile.fullName}
            </h1>
            <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-600 dark:text-violet-400">
              {profile.designation}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {profile.department} · Staff ID: <span className="font-mono font-medium">{profile.facultyId}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm gap-1.5" asChild>
            <Link href={"/faculty/notes" as any}>
              <Plus className="h-4 w-4" /> Create Note / Material
            </Link>
          </Button>
        </div>
      </div>

      {/* Official Attendance Policy Notice */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3.5 text-xs text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-indigo-500" />
          <span>
            <strong>Official Academic Attendance Rule:</strong> Attendance records originate live from institutional connectors. Faculty management focuses on course notes, assignments, and learning resources.
          </span>
        </div>
        <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] font-mono">
          Connector Sync Active
        </Badge>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-shelf relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Assigned Subjects
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-foreground">{assignedSubjects.length}</span>
              <span className="text-xs text-muted-foreground">courses</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-shelf relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Published Notes
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-foreground">{notes.length}</span>
              <span className="text-xs text-muted-foreground">materials</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-shelf relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Assignments
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-foreground">{assignments.length}</span>
              <span className="text-xs text-muted-foreground">active tasks</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-shelf relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Announcements
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Megaphone className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-foreground">{announcements.length}</span>
              <span className="text-xs text-muted-foreground">posted</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assigned Subjects Overview */}
        <Card className="glass-shelf lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">My Teaching Subjects</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link href={"/faculty/subjects" as any}>
                View all ({assignedSubjects.length}) <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {assignedSubjects.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No assigned subjects"
                description="Assigned courses will appear here based on institutional timetable scheduling."
              />
            ) : (
              <div className="space-y-3">
                {assignedSubjects.slice(0, 4).map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 p-3.5 transition-all hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: sub.color || "#5B7FFF" }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{sub.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          Code: {sub.code || "CS-301"} · Room: {sub.classroom || "Auditorium 2"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {sub.credits || 4} Credits
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Management Shortcuts */}
        <Card className="glass-shelf">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Faculty Console Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href={"/faculty/notes" as any}
              className="flex items-center justify-between rounded-xl border border-border/60 p-3.5 text-xs font-semibold transition-all hover:border-violet-500/40 hover:bg-violet-500/5"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-violet-500" />
                <span>Upload Lecture Notes</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              href={"/faculty/assignments" as any}
              className="flex items-center justify-between rounded-xl border border-border/60 p-3.5 text-xs font-semibold transition-all hover:border-indigo-500/40 hover:bg-indigo-500/5"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="h-4 w-4 text-indigo-500" />
                <span>Publish Course Assignment</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              href={"/faculty/announcements" as any}
              className="flex items-center justify-between rounded-xl border border-border/60 p-3.5 text-xs font-semibold transition-all hover:border-amber-500/40 hover:bg-amber-500/5"
            >
              <div className="flex items-center gap-2.5">
                <Megaphone className="h-4 w-4 text-amber-500" />
                <span>Post Class Announcement</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              href={"/faculty/timetable" as any}
              className="flex items-center justify-between rounded-xl border border-border/60 p-3.5 text-xs font-semibold transition-all hover:bg-muted/50"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <span>View Weekly Timetable</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
