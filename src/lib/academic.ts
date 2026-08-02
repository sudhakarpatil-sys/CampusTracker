import { getISODay } from "date-fns";
import type { AttendanceRecord } from "@/types/database.types";

/** Monday = 1 ... Sunday = 7, matching `timetable_slots.day_of_week`. */
export function todayISODay(date: Date = new Date()) {
  return getISODay(date);
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  cancelled: number;
  /** Percentage across classes that actually happened (excludes cancelled). */
  percentage: number;
}

export function computeAttendanceStats(records: Pick<AttendanceRecord, "status">[]): AttendanceStats {
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const cancelled = records.filter((r) => r.status === "cancelled").length;
  const countedTotal = present + absent;

  return {
    total: records.length,
    present,
    absent,
    cancelled,
    percentage: countedTotal === 0 ? 100 : Math.round((present / countedTotal) * 1000) / 10,
  };
}

export interface AttendancePrediction {
  /** How many more classes in a row can be missed and still hit the target. */
  canSkip: number;
  /** How many consecutive presents are needed to reach the target. */
  needToAttend: number;
  isBelowTarget: boolean;
}

/**
 * Classic "safe to bunk" math: given present/absent counts and a target
 * percentage, solve for how many more classes can be skipped (or must be
 * attended) before the percentage crosses the target.
 */
export function predictAttendance(stats: AttendanceStats, targetPercent: number): AttendancePrediction {
  const { present, absent } = stats;
  const counted = present + absent;
  const target = targetPercent / 100;

  if (counted === 0) {
    return { canSkip: 0, needToAttend: 0, isBelowTarget: false };
  }

  const currentRatio = present / counted;

  if (currentRatio >= target) {
    // present / (counted + n) >= target  =>  n <= present/target - counted
    const canSkip = target > 0 ? Math.floor(present / target - counted) : 999;
    return { canSkip: Math.max(canSkip, 0), needToAttend: 0, isBelowTarget: false };
  }

  // (present + n) / (counted + n) >= target  =>  n >= (target*counted - present) / (1 - target)
  const needToAttend = target < 1 ? Math.ceil((target * counted - present) / (1 - target)) : 999;
  return { canSkip: 0, needToAttend: Math.max(needToAttend, 0), isBelowTarget: true };
}

export function formatTime(time: string | null | undefined): string {
  if (!time || typeof time !== "string") return "12:00 AM";
  const mins = timeToMinutes(time);
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function timeToMinutes(time: string | null | undefined): number {
  if (!time || typeof time !== "string") return 0;
  const trimmed = time.trim();

  // Try 12-hour AM/PM format (e.g. "08:30 AM", "1:30 PM")
  const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1]!, 10);
    const minutes = parseInt(ampmMatch[2]!, 10);
    const period = ampmMatch[3]!.toLowerCase();
    if (period === "pm" && hours < 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // Standard 24-hour HH:MM or HH:MM:SS
  const [hStr, mStr] = trimmed.split(":");
  const h = parseInt(hStr || "0", 10);
  const m = parseInt(mStr || "0", 10);
  const hours = isNaN(h) ? 0 : h;
  const minutes = isNaN(m) ? 0 : m;
  return Math.max(0, Math.min(hours * 60 + minutes, 24 * 60 - 1));
}

export function minutesToTime(totalMinutes: number): string {
  if (isNaN(totalMinutes)) return "00:00";
  const clamped = Math.max(0, Math.min(totalMinutes, 24 * 60 - 1));
  const h = Math.floor(clamped / 60);
  const m = Math.round(clamped % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function daysUntil(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T00:00:00`);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
