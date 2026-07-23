"use client";

import { useParams } from "next/navigation";
import { NoteEditor, NoteEditorSkeleton } from "@/components/notes/note-editor";
import { useNotes } from "@/hooks/use-notes";

export default function NoteDetailPage() {
  const params = useParams<{ id: string }>();
  const { notes, isLoading } = useNotes();
  const note = notes.find((n) => n.id === params.id);

  if (isLoading) return <NoteEditorSkeleton />;
  if (!note) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        This note doesn&apos;t exist or was deleted.
      </div>
    );
  }

  return <NoteEditor note={note} />;
}
