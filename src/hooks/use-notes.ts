"use client";

import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import type { Note } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";

export function useNotes() {
  const { data, isLoading, refetch, supabase, userId } = useSupabaseCollection<Note>({
    table: "notes",
    orderBy: { column: "updated_at", ascending: false },
  });

  async function createNote(input: { title: string; subjectId?: string; content?: string }) {
    if (!userId) return { error: "Not signed in", id: null as string | null };
    const { data: inserted, error } = await supabase
      .from("notes")
      .insert({ user_id: userId, title: input.title, subject_id: input.subjectId || null, content: input.content ?? "" })
      .select("id")
      .single();
    if (error) {
      toast({ title: "Couldn't create note", description: error.message });
      return { error: error.message, id: null as string | null };
    }
    refetch();
    return { error: null, id: inserted?.id ?? null };
  }

  /** Silent (no toast) — called by the autosave debounce. */
  async function saveNote(id: string, patch: { title?: string; subjectId?: string | null; content?: string }) {
    const { error } = await supabase
      .from("notes")
      .update({
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.subjectId !== undefined ? { subject_id: patch.subjectId } : {}),
        ...(patch.content !== undefined ? { content: patch.content } : {}),
      })
      .eq("id", id);
    if (!error) refetch();
    return { error };
  }

  async function deleteNote(id: string) {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      toast({ title: "Couldn't delete note", description: error.message });
      return;
    }
    toast({ title: "Note deleted" });
    refetch();
  }

  return { notes: data, isLoading, createNote, saveNote, deleteNote, refetch };
}
