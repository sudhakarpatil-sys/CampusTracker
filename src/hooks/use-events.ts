"use client";

import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import type { CalendarEvent } from "@/types/database.types";
import type { EventInput } from "@/lib/validations/academic";
import { toast } from "@/hooks/use-toast";
import { logAuditEvent, AuditAction } from "@/lib/audit-log";

export function useEvents() {
  const { data, isLoading, refetch, supabase, userId } = useSupabaseCollection<CalendarEvent>({
    table: "events",
    orderBy: { column: "event_date", ascending: true },
  });

  function toPatch(input: Partial<EventInput>) {
    const patch: Record<string, unknown> = {};
    if (input.title !== undefined) patch.title = input.title;
    if (input.description !== undefined) patch.description = input.description || null;
    if (input.category !== undefined) patch.category = input.category;
    if (input.eventDate !== undefined) patch.event_date = input.eventDate;
    if (input.startTime !== undefined) patch.start_time = input.startTime || null;
    if (input.endTime !== undefined) patch.end_time = input.endTime || null;
    if (input.location !== undefined) patch.location = input.location || null;
    return patch;
  }

  async function createEvent(input: EventInput) {
    if (!userId) return { error: "Not signed in" };
    const { error } = await supabase.from("events").insert({ user_id: userId, ...toPatch(input) } as never);
    if (error) {
      toast({ title: "Couldn't create event", description: error.message });
      return { error: error.message };
    }
    toast({ title: "Event added" });
    logAuditEvent(supabase, userId, { action: AuditAction.EVENT_CREATE, entityType: "events", metadata: { title: input.title } });
    refetch();
    return { error: null };
  }

  async function updateEvent(id: string, input: Partial<EventInput>) {
    const { error } = await supabase.from("events").update(toPatch(input) as never).eq("id", id);
    if (error) toast({ title: "Couldn't update event", description: error.message });
    else logAuditEvent(supabase, userId!, { action: AuditAction.EVENT_UPDATE, entityType: "events", entityId: id });
    refetch();
  }

  async function deleteEvent(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      toast({ title: "Couldn't delete event", description: error.message });
      return;
    }
    toast({ title: "Event deleted" });
    logAuditEvent(supabase, userId!, { action: AuditAction.EVENT_DELETE, entityType: "events", entityId: id });
    refetch();
  }

  return { events: data, isLoading, createEvent, updateEvent, deleteEvent, refetch };
}
