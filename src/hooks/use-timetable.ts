"use client";

import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import type { TimetableSlot } from "@/types/database.types";
import type { TimetableSlotInput } from "@/lib/validations/academic";
import { toast } from "@/hooks/use-toast";

export function useTimetable() {
  const { data, isLoading, refetch, supabase, userId } = useSupabaseCollection<TimetableSlot>({
    table: "timetable_slots",
    orderBy: { column: "start_time", ascending: true },
  });

  async function createSlot(input: TimetableSlotInput) {
    if (!userId) return { error: "Not signed in" };
    const { error } = await supabase.from("timetable_slots").insert({
      user_id: userId,
      subject_id: input.subjectId,
      day_of_week: input.dayOfWeek,
      start_time: input.startTime,
      end_time: input.endTime,
      faculty_name: input.facultyName || null,
      classroom: input.classroom || null,
    });
    if (error) {
      toast({ title: "Couldn't add lecture", description: error.message });
      return { error: error.message };
    }
    toast({ title: "Lecture added" });
    refetch();
    return { error: null };
  }

  async function updateSlot(id: string, input: Partial<TimetableSlotInput>) {
    const patch: Record<string, unknown> = {};
    if (input.subjectId !== undefined) patch.subject_id = input.subjectId;
    if (input.dayOfWeek !== undefined) patch.day_of_week = input.dayOfWeek;
    if (input.startTime !== undefined) patch.start_time = input.startTime;
    if (input.endTime !== undefined) patch.end_time = input.endTime;
    if (input.facultyName !== undefined) patch.faculty_name = input.facultyName || null;
    if (input.classroom !== undefined) patch.classroom = input.classroom || null;

    const { error } = await supabase.from("timetable_slots").update(patch as never).eq("id", id);
    if (error) {
      toast({ title: "Couldn't update lecture", description: error.message });
      return { error: error.message };
    }
    refetch();
    return { error: null };
  }

  async function duplicateSlot(slot: TimetableSlot) {
    if (!userId) return;
    const { error } = await supabase.from("timetable_slots").insert({
      user_id: userId,
      subject_id: slot.subject_id,
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      faculty_name: slot.faculty_name,
      classroom: slot.classroom,
    });
    if (error) {
      toast({ title: "Couldn't duplicate lecture", description: error.message });
      return;
    }
    toast({ title: "Lecture duplicated" });
    refetch();
  }

  async function deleteSlot(id: string) {
    const { error } = await supabase.from("timetable_slots").delete().eq("id", id);
    if (error) {
      toast({ title: "Couldn't delete lecture", description: error.message });
      return;
    }
    toast({ title: "Lecture removed" });
    refetch();
  }

  function slotsForDay(day: number) {
    return data.filter((s) => s.day_of_week === day).sort((a, b) => a.start_time.localeCompare(b.start_time));
  }

  return { slots: data, isLoading, createSlot, updateSlot, duplicateSlot, deleteSlot, slotsForDay, refetch };
}
