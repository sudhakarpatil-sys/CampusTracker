"use client";

import Link from "next/link";
import { PartyPopper, Calendar as CalendarIcon } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { useEvents } from "@/hooks/use-events";
import { formatDate } from "@/lib/utils";

export function EventsWidget(props: { onHide?: () => void; draggableProps?: React.HTMLAttributes<HTMLButtonElement> }) {
  const { events } = useEvents();
  const upcoming = events.slice(0, 4);

  return (
    <WidgetShell title="Upcoming events" icon={PartyPopper} {...props}>
      {upcoming.length === 0 ? (
        <EmptyState icon={PartyPopper} title="Nothing on calendar" description="Add an event to see it here." className="py-6" />
      ) : (
        <div className="space-y-2.5">
          {upcoming.map((e) => (
            <Link
              key={e.id}
              href="/events"
              className="group flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-2.5 transition-all duration-200 hover:border-indigo-500/40 hover:bg-muted/40"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <CalendarIcon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="truncate text-xs font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {e.title}
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">{formatDate(e.event_date)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </WidgetShell>
  );
}
