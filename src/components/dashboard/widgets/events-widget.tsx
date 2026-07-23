"use client";

import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { useEvents } from "@/hooks/use-events";
import { formatDate } from "@/lib/utils";

export function EventsWidget(props: { onHide?: () => void; draggableProps?: React.HTMLAttributes<HTMLButtonElement> }) {
  const { events } = useEvents();
  const upcoming = events.slice(0, 5);

  return (
    <WidgetShell title="Upcoming events" icon={PartyPopper} {...props}>
      {upcoming.length === 0 ? (
        <EmptyState icon={PartyPopper} title="Nothing on the calendar" description="Add an event to see it here." className="py-6" />
      ) : (
        <ul className="space-y-3">
          {upcoming.map((e) => (
            <li key={e.id}>
              <Link href="/events" className="flex items-center justify-between gap-3 hover:opacity-80">
                <span className="truncate text-sm">{e.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDate(e.event_date)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </WidgetShell>
  );
}
