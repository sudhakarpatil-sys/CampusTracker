"use client";

import Link from "next/link";
import { NotebookText } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { useNotes } from "@/hooks/use-notes";
import { formatDate } from "@/lib/utils";

export function NotesWidget(props: { onHide?: () => void; draggableProps?: React.HTMLAttributes<HTMLButtonElement> }) {
  const { notes } = useNotes();
  const recent = notes.slice(0, 5);

  return (
    <WidgetShell title="Recent notes" icon={NotebookText} {...props}>
      {recent.length === 0 ? (
        <EmptyState icon={NotebookText} title="No notes yet" description="Notes you write will show up here." className="py-6" />
      ) : (
        <ul className="space-y-3">
          {recent.map((n) => (
            <li key={n.id}>
              <Link href={`/notes/${n.id}`} className="flex items-center justify-between gap-3 hover:opacity-80">
                <span className="truncate text-sm">{n.title || "Untitled note"}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDate(n.updated_at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </WidgetShell>
  );
}
