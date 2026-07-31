"use client";

import Link from "next/link";
import { NotebookText, FileText } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { useNotes } from "@/hooks/use-notes";
import { formatDate } from "@/lib/utils";

export function NotesWidget(props: { onHide?: () => void; draggableProps?: React.HTMLAttributes<HTMLButtonElement> }) {
  const { notes } = useNotes();
  const recent = notes.slice(0, 4);

  return (
    <WidgetShell title="Recent notes" icon={NotebookText} {...props}>
      {recent.length === 0 ? (
        <EmptyState icon={NotebookText} title="No notes yet" description="Notes you write will show up here." className="py-6" />
      ) : (
        <div className="space-y-2.5">
          {recent.map((n) => (
            <Link
              key={n.id}
              href={`/notes/${n.id}`}
              className="group flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-2.5 transition-all duration-200 hover:border-indigo-500/40 hover:bg-muted/40"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <FileText className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="truncate text-xs font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {n.title || "Untitled note"}
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">{formatDate(n.updated_at)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </WidgetShell>
  );
}
