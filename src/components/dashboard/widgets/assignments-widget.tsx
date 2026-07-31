"use client";

import Link from "next/link";
import { ListChecks, Calendar, Clock } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useAssignments } from "@/hooks/use-assignments";
import { formatDate } from "@/lib/utils";

const PRIORITY_STYLES = {
  low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  high: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
} as const;

export function AssignmentsWidget(props: { onHide?: () => void; draggableProps?: React.HTMLAttributes<HTMLButtonElement> }) {
  const { assignments } = useAssignments();
  const upcoming = assignments.filter((a) => a.status !== "completed").slice(0, 4);

  return (
    <WidgetShell title="Upcoming assignments" icon={ListChecks} {...props}>
      {upcoming.length === 0 ? (
        <EmptyState icon={ListChecks} title="Nothing due" description="New assignments will show up here." className="py-6" />
      ) : (
        <div className="space-y-2.5">
          {upcoming.map((a) => (
            <Link
              key={a.id}
              href="/assignments"
              className="group flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-2.5 transition-all duration-200 hover:border-indigo-500/40 hover:bg-muted/40"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="truncate text-xs font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {a.title}
                </p>
                {a.due_date && (
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                    <Clock className="h-3 w-3" /> {formatDate(a.due_date)}
                  </p>
                )}
              </div>

              <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${PRIORITY_STYLES[a.priority]}`}>
                {a.priority}
              </span>
            </Link>
          ))}
        </div>
      )}
    </WidgetShell>
  );
}
