"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, NotebookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useNotes } from "@/hooks/use-notes";
import { useSubjects } from "@/hooks/use-subjects";
import { formatDate, cn } from "@/lib/utils";

export function NotesList({ activeNoteId }: { activeNoteId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { notes, isLoading, createNote } = useNotes();
  const { subjectsById } = useSubjects();

  async function handleCreate() {
    const { id } = await createNote({ title: "Untitled note" });
    if (id) router.push(`/notes/${id}`);
  }

  return (
    <div className="flex h-full flex-col border-r border-border/60">
      <div className="flex items-center justify-between p-3">
        <p className="text-sm font-medium">All notes</p>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCreate}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="mb-2 h-14 w-full" />)}

        {!isLoading && notes.length === 0 && (
          <EmptyState icon={NotebookText} title="No notes yet" description="Create your first note to get started." />
        )}

        {!isLoading &&
          notes.map((note) => {
            const subject = note.subject_id ? subjectsById.get(note.subject_id) : undefined;
            const isActive = pathname === `/notes/${note.id}` || note.id === activeNoteId;
            return (
              <Link
                key={note.id}
                href={`/notes/${note.id}` as never}
                className={cn("mb-1 block rounded-lg px-3 py-2 text-sm transition-colors", isActive ? "bg-accent/15" : "hover:bg-muted")}
              >
                <p className="truncate font-medium">{note.title || "Untitled note"}</p>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {subject && (
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: subject.color }} />
                      {subject.name}
                    </span>
                  )}
                  <span>{formatDate(note.updated_at)}</span>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
