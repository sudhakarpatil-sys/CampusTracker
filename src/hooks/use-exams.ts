"use client";

import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import type { Exam } from "@/types/database.types";
import type { ExamInput } from "@/lib/validations/academic";
import { toast } from "@/hooks/use-toast";
import { logAuditEvent, AuditAction } from "@/lib/audit-log";

export function useExams() {
  const { data, isLoading, refetch, supabase, userId } = useSupabaseCollection<Exam>({
    table: "exams",
    orderBy: { column: "exam_date", ascending: true },
  });

  function toPatch(input: Partial<ExamInput>) {
    const patch: Record<string, unknown> = {};
    if (input.subjectId !== undefined) patch.subject_id = input.subjectId || null;
    if (input.examDate !== undefined) patch.exam_date = input.examDate;
    if (input.examTime !== undefined) patch.exam_time = input.examTime || null;
    if (input.venue !== undefined) patch.venue = input.venue || null;
    if (input.syllabus !== undefined) patch.syllabus = input.syllabus || null;
    if (input.preparationStatus !== undefined) patch.preparation_status = input.preparationStatus;
    return patch;
  }

  async function createExam(input: ExamInput) {
    if (!userId) return { error: "Not signed in" };
    const { error } = await supabase.from("exams").insert({ user_id: userId, ...toPatch(input) } as never);
    if (error) {
      toast({ title: "Couldn't add exam", description: error.message });
      return { error: error.message };
    }
    toast({ title: "Exam added" });
    logAuditEvent(supabase, userId, { action: AuditAction.EXAM_CREATE, entityType: "exams", metadata: { subjectId: input.subjectId } });
    refetch();
    return { error: null };
  }

  async function updateExam(id: string, input: Partial<ExamInput>) {
    const { error } = await supabase.from("exams").update(toPatch(input) as never).eq("id", id);
    if (error) toast({ title: "Couldn't update exam", description: error.message });
    else logAuditEvent(supabase, userId!, { action: AuditAction.EXAM_UPDATE, entityType: "exams", entityId: id });
    refetch();
  }

  async function deleteExam(id: string) {
    const { error } = await supabase.from("exams").delete().eq("id", id);
    if (error) {
      toast({ title: "Couldn't delete exam", description: error.message });
      return;
    }
    toast({ title: "Exam deleted" });
    logAuditEvent(supabase, userId!, { action: AuditAction.EXAM_DELETE, entityType: "exams", entityId: id });
    refetch();
  }

  return { exams: data, isLoading, createExam, updateExam, deleteExam, refetch };
}
