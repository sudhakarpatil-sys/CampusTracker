"use client";

import * as React from "react";
import { FileSpreadsheet, Plus, Trash2, Calendar as CalendarIcon, Clock, Send, Archive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useAssignments } from "@/hooks/use-assignments";
import { useFaculty } from "@/hooks/use-faculty";
import { formatDate, cn } from "@/lib/utils";

export function FacultyAssignmentsManagerContent() {
  const { assignments, isLoading, createAssignment, archiveAssignment, deleteAssignment } = useAssignments();
  const { assignedSubjects, publishFacultyEvent } = useFaculty();

  const [title, setTitle] = React.useState("");
  const [subjectId, setSubjectId] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [priority, setPriority] = React.useState<"low" | "medium" | "high">("medium");
  const [description, setDescription] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  async function handleCreate() {
    if (!title.trim()) return;
    setIsCreating(true);

    const res = await createAssignment({
      title,
      subjectId: subjectId || undefined,
      dueDate: dueDate || undefined,
      priority,
      description,
      status: "in_progress",
    });

    if (!res.error) {
      publishFacultyEvent("AssignmentCreated", {
        title,
        subjectId,
        dueDate,
        priority,
      });

      setTitle("");
      setSubjectId("");
      setDueDate("");
      setDescription("");
    }
    setIsCreating(false);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Course Assignments & Tasks
        </h1>
        <p className="text-sm text-muted-foreground">
          Create, schedule, and publish academic assignments with due dates and priority tiers.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <Card className="glass-shelf lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-500" /> Create New Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Assignment Title</label>
              <Input
                placeholder="e.g. Lab 4 — Relational Schema Normalization"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Subject</label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select course..." />
                </SelectTrigger>
                <SelectContent>
                  {assignedSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">
                      {s.name} ({s.code || "CS"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Due Date</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Priority Tier</label>
                <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-xs">Low Priority</SelectItem>
                    <SelectItem value="medium" className="text-xs">Medium Priority</SelectItem>
                    <SelectItem value="high" className="text-xs">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Description & Instructions</label>
              <Textarea
                placeholder="Submission guidelines, rubrics, or link to project specs..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] text-xs"
              />
            </div>

            <Button
              onClick={handleCreate}
              disabled={isCreating || !title.trim()}
              className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 text-white gap-1.5 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              {isCreating ? "Publishing..." : "Publish Assignment"}
            </Button>
          </CardContent>
        </Card>

        {/* Assignments List */}
        <Card className="glass-shelf lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Active Assignments ({assignments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <EmptyState
                icon={FileSpreadsheet}
                title="No active assignments"
                description="Publish tasks and lab problem sets to manage student deadlines."
              />
            ) : (
              <div className="space-y-3">
                {assignments.map((asgn) => (
                  <div
                    key={asgn.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 p-4 transition-all hover:bg-muted/30"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-foreground">{asgn.title}</h4>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-mono uppercase",
                            asgn.priority === "high" ? "border-rose-500/30 text-rose-500 bg-rose-500/10" : "border-indigo-500/30 text-indigo-500"
                          )}
                        >
                          {asgn.priority}
                        </Badge>
                      </div>
                      {asgn.due_date && (
                        <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3 text-indigo-500" /> Due: {formatDate(asgn.due_date)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => archiveAssignment(asgn.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Archive Assignment"
                      >
                        <Archive className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAssignment(asgn.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                        title="Delete Assignment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
