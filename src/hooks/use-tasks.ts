"use client";

import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import type { Task } from "@/types/database.types";
import type { TaskInput } from "@/lib/validations/academic";
import { toast } from "@/hooks/use-toast";

export function useTasks() {
  const { data, isLoading, refetch, supabase, userId } = useSupabaseCollection<Task>({
    table: "tasks",
    orderBy: { column: "created_at", ascending: false },
  });

  async function createTask(input: TaskInput) {
    if (!userId) return { error: "Not signed in" };
    const { error } = await supabase.from("tasks").insert({
      user_id: userId,
      title: input.title,
      due_date: input.dueDate || null,
      priority: input.priority,
    });
    if (error) {
      toast({ title: "Couldn't create task", description: error.message });
      return { error: error.message };
    }
    refetch();
    return { error: null };
  }

  async function updateTask(id: string, input: Partial<TaskInput>) {
    const patch: Record<string, unknown> = {};
    if (input.title !== undefined) patch.title = input.title;
    if (input.dueDate !== undefined) patch.due_date = input.dueDate || null;
    if (input.priority !== undefined) patch.priority = input.priority;
    const { error } = await supabase.from("tasks").update(patch as never).eq("id", id);
    if (error) toast({ title: "Couldn't update task", description: error.message });
    refetch();
  }

  async function toggleComplete(id: string, isCompleted: boolean) {
    await supabase.from("tasks").update({ is_completed: isCompleted }).eq("id", id);
    refetch();
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      toast({ title: "Couldn't delete task", description: error.message });
      return;
    }
    refetch();
  }

  return {
    tasks: data,
    pendingTasks: data.filter((t) => !t.is_completed),
    completedTasks: data.filter((t) => t.is_completed),
    isLoading,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
    refetch,
  };
}
