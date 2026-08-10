"use client";

import * as React from "react";
import { Activity, FileText, FileSpreadsheet, Megaphone, FolderKanban, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useNotes } from "@/hooks/use-notes";
import { useAssignments } from "@/hooks/use-assignments";
import { useEvents } from "@/hooks/use-events";
import { formatDate } from "@/lib/utils";

export function FacultyActivityTimelineContent() {
  const { notes, isLoading: isNotesLoading } = useNotes();
  const { assignments, isLoading: isAssignmentsLoading } = useAssignments();
  const { events: announcements, isLoading: isAnnouncementsLoading } = useEvents();

  const isLoading = isNotesLoading || isAssignmentsLoading || isAnnouncementsLoading;

  const activityFeed = React.useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      type: "note" | "assignment" | "announcement";
      date: string;
    }> = [];

    notes.forEach((n) => {
      items.push({ id: n.id, title: `Published Note: ${n.title}`, type: "note", date: n.created_at });
    });

    assignments.forEach((a) => {
      items.push({ id: a.id, title: `Created Assignment: ${a.title}`, type: "assignment", date: a.created_at });
    });

    announcements.forEach((anc) => {
      items.push({ id: anc.id, title: `Posted Announcement: ${anc.title}`, type: "announcement", date: anc.created_at });
    });

    return items.sort((a, b) => b.date.localeCompare(a.date));
  }, [notes, assignments, announcements]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Faculty Publishing Activity Log
        </h1>
        <p className="text-sm text-muted-foreground">
          Audit timeline of notes published, assignments created, and class announcements posted.
        </p>
      </div>

      <Card className="glass-shelf overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Publishing Audit Feed</CardTitle>
        </CardHeader>
        <CardContent>
          {activityFeed.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No activity recorded"
              description="Activity timeline will automatically record your notes, assignments, and announcements."
            />
          ) : (
            <div className="relative border-l-2 border-border/60 pl-6 space-y-6 my-2">
              {activityFeed.map((act) => (
                <div key={act.id} className="relative">
                  {/* Dot icon */}
                  <span className="absolute -left-[31px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-card border border-border shadow-xs">
                    {act.type === "note" && <FileText className="h-3 w-3 text-violet-500" />}
                    {act.type === "assignment" && <FileSpreadsheet className="h-3 w-3 text-emerald-500" />}
                    {act.type === "announcement" && <Megaphone className="h-3 w-3 text-amber-500" />}
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-foreground">{act.title}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatDate(act.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
