"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, NotebookText, FileText } from "lucide-react";
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
    <div className="flex h-full flex-col border-r border-border/60 bg-card/40">
      <div className="flex items-center justify-between border-b border-border/50 p-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <NotebookText className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs font-bold tracking-tight text-foreground">ALL NOTES ({notes.length})</p>
        </div>
        <Button size="icon" variant="outline" className="h-7 w-7 border-indigo-500/30 hover:bg-indigo-500 hover:text-white" onClick={handleCreate}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto p-2 space-y-1.5">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}

        {!isLoading && notes.length === 0 && (
          <EmptyState icon={NotebookText} title="No notes yet" description="Create your first note to get started." className="py-8" />
        )}

        {!isLoading &&
          notes.map((note) => {
            const subject = note.subject_id ? subjectsById.get(note.subject_id) : undefined;
            const isActive = pathname === `/notes/${note.id}` || note.id === activeNoteId;
            return (
              <Link
                key={note.id}
                href={`/notes/${note.id}` as never}
                className={cn(
                  "group block rounded-xl border p-3 text-sm transition-all duration-200",
                  isActive
                    ? "border-indigo-500/50 bg-indigo-500/10 text-foreground shadow-sm"
                    : "border-border/50 bg-muted/20 hover:border-indigo-500/30 hover:bg-muted/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <FileText className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground")} />
                  <p className="truncate text-xs font-semibold text-foreground">{note.title || "Untitled note"}</p>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  {subject ? (
                    <span className="flex items-center gap-1 truncate">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
                      <span className="truncate">{subject.name}</span>
                    </span>
                  ) : (
                    <span>General</span>
                  )}
                  <span className="shrink-0">{formatDate(note.updated_at)}</span>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
