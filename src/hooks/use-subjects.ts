"use client";

import * as React from "react";
import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import type { Subject } from "@/types/database.types";
import type { SubjectInput } from "@/lib/validations/academic";
import { toast } from "@/hooks/use-toast";
import { logAuditEvent, AuditAction } from "@/lib/audit-log";

export function useSubjects(options?: { includeArchived?: boolean }) {
  const { data, isLoading, refetch, supabase, userId } = useSupabaseCollection<Subject>({
    table: "subjects",
    orderBy: { column: "name", ascending: true },
  });

  const subjects = options?.includeArchived ? data : data.filter((s) => !s.is_archived);
  const archivedSubjects = data.filter((s) => s.is_archived);

  async function createSubject(input: SubjectInput) {
    if (!userId) return { error: "Not signed in" };
    const { error } = await supabase.from("subjects").insert({
      user_id: userId,
      name: input.name,
      code: input.code || null,
      faculty_name: input.facultyName || null,
      classroom: input.classroom || null,
      credits: input.credits ?? null,
      attendance_target: input.attendanceTarget,
      color: input.color,
    });
    if (error) {
      toast({ title: "Couldn't create subject", description: error.message });
      return { error: error.message };
    }
    toast({ title: "Subject added" });
    logAuditEvent(supabase, userId, { action: AuditAction.SUBJECT_CREATE, entityType: "subjects", metadata: { name: input.name } });
    refetch();
    return { error: null };
  }

  async function updateSubject(id: string, input: SubjectInput) {
    const { error } = await supabase
      .from("subjects")
      .update({
        name: input.name,
        code: input.code || null,
        faculty_name: input.facultyName || null,
        classroom: input.classroom || null,
        credits: input.credits ?? null,
        attendance_target: input.attendanceTarget,
        color: input.color,
      })
      .eq("id", id);
    if (error) {
      toast({ title: "Couldn't update subject", description: error.message });
      return { error: error.message };
    }
    toast({ title: "Subject updated" });
    logAuditEvent(supabase, userId!, { action: AuditAction.SUBJECT_UPDATE, entityType: "subjects", entityId: id, metadata: { name: input.name } });
    refetch();
    return { error: null };
  }

  async function archiveSubject(id: string) {
    await supabase.from("subjects").update({ is_archived: true }).eq("id", id);
    toast({ title: "Subject archived" });
    logAuditEvent(supabase, userId!, { action: AuditAction.SUBJECT_DELETE, entityType: "subjects", entityId: id, metadata: { archived: true } });
    refetch();
  }

  async function restoreSubject(id: string) {
    await supabase.from("subjects").update({ is_archived: false }).eq("id", id);
    toast({ title: "Subject restored" });
    refetch();
  }

  async function deleteSubject(id: string) {
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) {
      toast({ title: "Couldn't delete subject", description: error.message });
      return;
    }
    toast({ title: "Subject deleted" });
    logAuditEvent(supabase, userId!, { action: AuditAction.SUBJECT_DELETE, entityType: "subjects", entityId: id });
    refetch();
  }

  const subjectsById = React.useMemo(() => {
    const map = new Map<string, Subject>();
    data.forEach((s) => map.set(s.id, s));
    return map;
  }, [data]);

  return {
    subjects,
    archivedSubjects,
    allSubjects: data,
    subjectsById,
    isLoading,
    createSubject,
    updateSubject,
    archiveSubject,
    restoreSubject,
    deleteSubject,
    refetch,
  };
}
