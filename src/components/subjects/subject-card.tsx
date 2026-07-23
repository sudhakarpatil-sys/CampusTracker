"use client";

import { Archive, ArchiveRestore, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SubjectFormDialog } from "@/components/subjects/subject-form-dialog";
import type { Subject } from "@/types/database.types";
import type { SubjectInput } from "@/lib/validations/academic";
import type { AttendanceStats } from "@/lib/academic";

interface SubjectCardProps {
  subject: Subject;
  stats?: AttendanceStats;
  onUpdate: (id: string, input: SubjectInput) => Promise<{ error: string | null } | void>;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SubjectCard({ subject, stats, onUpdate, onArchive, onRestore, onDelete }: SubjectCardProps) {
  const isBelowTarget = stats && stats.percentage < subject.attendance_target;

  return (
    <Card className="overflow-hidden">
      <div className="h-1.5 w-full" style={{ backgroundColor: subject.color }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-display font-semibold">{subject.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {[subject.code, subject.faculty_name, subject.classroom].filter(Boolean).join(" · ") || "No details yet"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <SubjectFormDialog
                subject={subject}
                onSubmit={(values) => onUpdate(subject.id, values)}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                }
              />
              {subject.is_archived ? (
                <DropdownMenuItem onClick={() => onRestore(subject.id)}>
                  <ArchiveRestore className="mr-2 h-4 w-4" /> Restore
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onArchive(subject.id)}>
                  <Archive className="mr-2 h-4 w-4" /> Archive
                </DropdownMenuItem>
              )}
              <ConfirmDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                }
                title={`Delete ${subject.name}?`}
                description="This also removes its timetable lectures and attendance history. This cannot be undone."
                onConfirm={() => onDelete(subject.id)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {stats && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Attendance</span>
              <span className="font-medium">{stats.percentage}%</span>
            </div>
            <Progress value={stats.percentage} className="h-1.5" />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {stats.present}P · {stats.absent}A · {stats.cancelled}C
              </p>
              {isBelowTarget && (
                <Badge variant="destructive" className="text-[10px]">
                  Below target
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
