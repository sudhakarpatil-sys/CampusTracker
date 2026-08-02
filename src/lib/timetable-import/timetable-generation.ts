import { timeToMinutes } from "@/lib/academic";
import type { AiDetectedSlot } from "@/lib/validations/timetable-import";

/** Wrap time to minutes parsing with format + range check, supporting both
 * 24-hour ("08:30", "14:30", "08:30:00") and 12-hour AM/PM ("08:30 AM", "1:30 PM"). */
export function safeTimeToMinutes(time: string): number | null {
  if (!time || typeof time !== "string") return null;
  const trimmed = time.trim();

  // 12-hour format with AM/PM (e.g. "08:30 AM", "1:30 PM", "11:45 AM")
  const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1]!, 10);
    const minutes = parseInt(ampmMatch[2]!, 10);
    const period = ampmMatch[3]!.toLowerCase();

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;
    if (period === "pm" && hours < 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // 24-hour format (e.g. "08:30", "14:30", "08:30:00")
  const standardMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (standardMatch) {
    const hours = parseInt(standardMatch[1]!, 10);
    const minutes = parseInt(standardMatch[2]!, 10);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  return null;
}

/** Formats a time string into 24-hour "HH:MM" format. */
export function normalizeTimeString(time: string): string {
  const mins = safeTimeToMinutes(time);
  if (mins === null) return time.trim();
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export interface SlotValidation {
  valid: boolean;
  reason: string | null;
}

/** Deterministic sanity checks the AI's output should already satisfy —
 * a safety net against malformed times/days slipping through, not a
 * substitute for the schema validation already run on the AI response. */
export function validateSlot(slot: AiDetectedSlot): SlotValidation {
  if (slot.day_of_week < 1 || slot.day_of_week > 7) {
    return { valid: false, reason: "Day of week couldn't be determined" };
  }
  const start = safeTimeToMinutes(slot.start_time);
  const end = safeTimeToMinutes(slot.end_time);
  if (start === null || end === null) {
    return { valid: false, reason: "Lecture time couldn't be read clearly" };
  }
  if (end <= start) {
    return { valid: false, reason: "End time is before the start time" };
  }
  return { valid: true, reason: null };
}

export interface NormalizedSlot extends AiDetectedSlot {
  isValid: boolean;
  conflictReason: string | null;
}

/**
 * Flags lectures that overlap another detected lecture on the same day —
 * almost always a sign the AI misread a multi-division layout (e.g. two
 * divisions' parallel labs merged into one slot instead of being kept
 * separate/filtered to the student's own division). Doesn't touch
 * existing timetable data; this only compares detected slots against
 * each other, within this one import.
 */
export function detectOverlaps(slots: AiDetectedSlot[]): NormalizedSlot[] {
  const withValidation = slots.map((slot) => {
    const { valid, reason } = validateSlot(slot);
    return { ...slot, isValid: valid, conflictReason: reason };
  });

  const byDay = new Map<number, typeof withValidation>();
  for (const slot of withValidation) {
    if (!slot.isValid) continue;
    const bucket = byDay.get(slot.day_of_week) ?? [];
    bucket.push(slot);
    byDay.set(slot.day_of_week, bucket);
  }

  for (const bucket of byDay.values()) {
    for (let i = 0; i < bucket.length; i++) {
      for (let j = i + 1; j < bucket.length; j++) {
        const a = bucket[i]!;
        const b = bucket[j]!;
        const aStart = safeTimeToMinutes(a.start_time)!;
        const aEnd = safeTimeToMinutes(a.end_time)!;
        const bStart = safeTimeToMinutes(b.start_time)!;
        const bEnd = safeTimeToMinutes(b.end_time)!;
        const overlaps = aStart < bEnd && bStart < aEnd;
        if (overlaps) {
          a.conflictReason = a.conflictReason ?? `Overlaps with ${b.subject_name}`;
          b.conflictReason = b.conflictReason ?? `Overlaps with ${a.subject_name}`;
        }
      }
    }
  }

  return withValidation;
}
