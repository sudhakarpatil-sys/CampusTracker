"use client";

import * as React from "react";
import { format } from "date-fns";
import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import type { AttendanceRecord } from "@/types/database.types";
import { computeAttendanceStats, predictAttendance } from "@/lib/academic";
import { toast } from "@/hooks/use-toast";
import { logAuditEvent, AuditAction } from "@/lib/audit-log";

export type AttendanceStatus = "present" | "absent" | "cancelled";

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: "Marked present",
  absent: "Marked absent",
  cancelled: "Marked cancelled",
};

export function useAttendance() {
  const { data, setData, isLoading, refetch, supabase, userId } = useSupabaseCollection<AttendanceRecord>({
    table: "attendance_records",
    orderBy: { column: "class_date", ascending: false },
  });

  /**
   * One click: applies the new status to local state immediately (so
   * percentage/analytics/prediction and every widget reading this hook
   * re-render instantly, with no page refresh), then upserts to Supabase
   * in the background on the (user, slot, date) unique constraint. Rolls
   * back and shows an error toast if the save fails.
   */
  async function markAttendance(params: { subjectId: string; timetableSlotId: string; date?: Date; status: AttendanceStatus }) {
    if (!userId) return;
    const classDate = format(params.date ?? new Date(), "yyyy-MM-dd");
    const previous = data;

    const existing = data.find((r) => r.timetable_slot_id === params.timetableSlotId && r.class_date === classDate);
    const optimisticRecord: AttendanceRecord = {
      id: existing?.id ?? `optimistic-${params.timetableSlotId}-${classDate}`,
      user_id: userId,
      subject_id: params.subjectId,
      timetable_slot_id: params.timetableSlotId,
      class_date: classDate,
      status: params.status,
      created_at: existing?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setData((prev) => {
      const next = prev.filter((r) => r.id !== optimisticRecord.id);
      next.push(optimisticRecord);
      return next;
    });

    const { error } = await supabase.from("attendance_records").upsert(
      {
        user_id: userId,
        subject_id: params.subjectId,
        timetable_slot_id: params.timetableSlotId,
        class_date: classDate,
        status: params.status,
      },
      { onConflict: "user_id,timetable_slot_id,class_date" }
    );

    if (error) {
      setData(previous); // roll back the optimistic change
      toast({ title: "Couldn't save attendance", description: error.message });
      return { error: error.message };
    }

    toast({ title: STATUS_LABEL[params.status], variant: params.status === "present" ? "success" : "default" });

    // Fire-and-forget audit log — never blocks the user action.
    logAuditEvent(supabase, userId, {
      action: AuditAction.ATTENDANCE_MARK,
      entityType: "attendance_records",
      entityId: params.timetableSlotId,
      metadata: { status: params.status, subjectId: params.subjectId, classDate },
    });

    refetch();
    return { error: null };
  }

  function statusFor(timetableSlotId: string, date: Date = new Date()) {
    const classDate = format(date, "yyyy-MM-dd");
    return data.find((r) => r.timetable_slot_id === timetableSlotId && r.class_date === classDate)?.status ?? null;
  }

  function recordsForSubject(subjectId: string) {
    return data.filter((r) => r.subject_id === subjectId);
  }

  const statsBySubject = React.useMemo(() => {
    const map = new Map<string, ReturnType<typeof computeAttendanceStats>>();
    const bySubject = new Map<string, AttendanceRecord[]>();
    data.forEach((r) => {
      const list = bySubject.get(r.subject_id) ?? [];
      list.push(r);
      bySubject.set(r.subject_id, list);
    });
    bySubject.forEach((records, subjectId) => map.set(subjectId, computeAttendanceStats(records)));
    return map;
  }, [data]);

  const overallStats = React.useMemo(() => computeAttendanceStats(data), [data]);

  function predictionFor(subjectId: string, targetPercent: number) {
    const stats = statsBySubject.get(subjectId) ?? computeAttendanceStats([]);
    return predictAttendance(stats, targetPercent);
  }

  return {
    records: data,
    isLoading,
    markAttendance,
    statusFor,
    recordsForSubject,
    statsBySubject,
    overallStats,
    predictionFor,
    refetch,
  };
}
