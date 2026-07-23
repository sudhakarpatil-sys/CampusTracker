"use client";

import { Plus, PartyPopper, Pencil, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EventFormDialog } from "@/components/events/event-form-dialog";
import { useEvents } from "@/hooks/use-events";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { formatTime, daysUntil } from "@/lib/academic";
import { formatDate } from "@/lib/utils";

export function EventList() {
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useEvents();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <EventFormDialog
          onSubmit={createEvent}
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4" /> New event
            </Button>
          }
        />
      </div>

      {events.length === 0 ? (
        <EmptyState icon={PartyPopper} title="No events yet" description="Add college events, workshops, hackathons, or personal reminders." />
      ) : (
        <div className="space-y-2">
          {events.map((event) => {
            const days = daysUntil(event.event_date);
            const category = EVENT_CATEGORIES.find((c) => c.value === event.category);
            return (
              <Card key={event.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{event.title}</p>
                    <Badge variant="secondary" className="text-[10px]">
                      {category?.label ?? event.category}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(event.event_date)}
                    {event.start_time ? ` · ${formatTime(event.start_time)}` : ""}
                    {event.location ? (
                      <span className="ml-1 inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {event.location}
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={days < 0 ? "secondary" : "accent"} className="whitespace-nowrap text-[10px]">
                    {days === 0 ? "Today" : days > 0 ? `In ${days}d` : "Past"}
                  </Badge>
                  <EventFormDialog
                    event={event}
                    onSubmit={(values) => updateEvent(event.id, values)}
                    trigger={
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    }
                  />
                  <ConfirmDialog
                    trigger={
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    }
                    title={`Delete "${event.title}"?`}
                    description="This cannot be undone."
                    onConfirm={() => deleteEvent(event.id)}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
