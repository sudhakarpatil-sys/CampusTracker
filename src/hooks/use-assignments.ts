"use client";

import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import type { Assignment } from "@/types/database.types";
import type { AssignmentInput } from "@/lib/validations/academic";
import { toast } from "@/hooks/use-toast";

export function useAssignments(options?: { includeArchived?: boolean }) {
  const { data, isLoading, refetch, supabase, userId } = useSupabaseCollection<Assignment>({
    table: "assignments",
    orderBy: { column: "due_date", ascending: true },
  });

  const assignments = options?.includeArchived ? data : data.filter((a) => !a.is_archived);

  function toPatch(input: Partial<AssignmentInput>) {
    const patch: Record<string, unknown> = {};
    if (input.title !== undefined) patch.title = input.title;
    if (input.subjectId !== undefined) patch.subject_id = input.subjectId || null;
    if (input.description !== undefined) patch.description = input.description || null;
    if (input.dueDate !== undefined) patch.due_date = input.dueDate || null;
    if (input.dueTime !== undefined) patch.due_time = input.dueTime || null;
    if (input.priority !== undefined) patch.priority = input.priority;
    if (input.status !== undefined) patch.status = input.status;
    if (input.notes !== undefined) patch.notes = input.notes || null;
    return patch;
  }

  async function createAssignment(input: AssignmentInput) {
    if (!userId) return { error: "Not signed in" };
    const { error } = await supabase.from("assignments").insert({ user_id: userId, ...toPatch(input) } as never);
    if (error) {
      toast({ title: "Couldn't create assignment", description: error.message });
      return { error: error.message };
    }
    toast({ title: "Assignment created" });
    refetch();
    return { error: null };
  }

  async function updateAssignment(id: string, input: Partial<AssignmentInput>) {
    const { error } = await supabase.from("assignments").update(toPatch(input) as never).eq("id", id);
    if (error) {
      toast({ title: "Couldn't update assignment", description: error.message });
      return { error: error.message };
    }
    refetch();
    return { error: null };
  }

  /** Optimistic status update for drag-and-drop between Kanban columns. */
  async function setStatus(id: string, status: AssignmentInput["status"]) {
    const { error } = await supabase.from("assignments").update({ status }).eq("id", id);
    if (error) toast({ title: "Couldn't move assignment", description: error.message });
    refetch();
  }

  async function duplicateAssignment(assignment: Assignment) {
    if (!userId) return;
    const { error } = await supabase.from("assignments").insert({
      user_id: userId,
      title: `${assignment.title} (copy)`,
      subject_id: assignment.subject_id,
      description: assignment.description,
      due_date: assignment.due_date,
      due_time: assignment.due_time,
      priority: assignment.priority,
      status: "not_started",
      notes: assignment.notes,
    });
    if (error) {
      toast({ title: "Couldn't duplicate assignment", description: error.message });
      return;
    }
    toast({ title: "Assignment duplicated" });
    refetch();
  }

  async function archiveAssignment(id: string) {
    await supabase.from("assignments").update({ is_archived: true }).eq("id", id);
    toast({ title: "Assignment archived" });
    refetch();
  }

  async function restoreAssignment(id: string) {
    await supabase.from("assignments").update({ is_archived: false }).eq("id", id);
    toast({ title: "Assignment restored" });
    refetch();
  }

  async function deleteAssignment(id: string) {
    const { error } = await supabase.from("assignments").delete().eq("id", id);
    if (error) {
      toast({ title: "Couldn't delete assignment", description: error.message });
      return;
    }
    toast({ title: "Assignment deleted" });
    refetch();
  }

  return {
    assignments,
    archivedAssignments: data.filter((a) => a.is_archived),
    isLoading,
    createAssignment,
    updateAssignment,
    setStatus,
    duplicateAssignment,
    archiveAssignment,
    restoreAssignment,
    deleteAssignment,
    refetch,
  };
}
