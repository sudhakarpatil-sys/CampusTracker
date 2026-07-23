"use client";

import Link from "next/link";
import { ListChecks } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useAssignments } from "@/hooks/use-assignments";
import { formatDate } from "@/lib/utils";

const PRIORITY_VARIANT = { low: "secondary", medium: "accent", high: "destructive" } as const;

export function AssignmentsWidget(props: { onHide?: () => void; draggableProps?: React.HTMLAttributes<HTMLButtonElement> }) {
  const { assignments } = useAssignments();
  const upcoming = assignments.filter((a) => a.status !== "completed").slice(0, 5);

  return (
    <WidgetShell title="Upcoming assignments" icon={ListChecks} {...props}>
      {upcoming.length === 0 ? (
        <EmptyState icon={ListChecks} title="Nothing due" description="New assignments will show up here." className="py-6" />
      ) : (
        <ul className="space-y-3">
          {upcoming.map((a) => (
            <li key={a.id}>
              <Link href="/assignments" className="flex items-start justify-between gap-3 hover:opacity-80">
                <span className="truncate text-sm">{a.title}</span>
                <Badge variant={PRIORITY_VARIANT[a.priority]} className="shrink-0 whitespace-nowrap text-[10px]">
                  {a.due_date ? formatDate(a.due_date) : a.priority}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </WidgetShell>
  );
}
