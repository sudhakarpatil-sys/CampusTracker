import { timeToMinutes } from "@/lib/academic";
import type { AiDetectedSlot } from "@/lib/validations/timetable-import";

const TIME_FORMAT = /^\d{1,2}:\d{2}(:\d{2})?$/;

/** `timeToMinutes` (lib/academic.ts) assumes well-formed "HH:MM" input and
 * happily returns NaN/garbage on anything else — fine for rendering
 * already-valid DB rows, not safe for untrusted AI output. This wraps it
 * with the format + range check AI-generated times actually need.
 *
 * Accepts both raw AI-extracted "HH:MM" strings (pre-DB-write, in memory)
 * and "HH:MM:SS" strings — Postgres `time` columns come back from
 * Supabase with seconds, which this needs to tolerate since it's also
 * used to re-validate values already round-tripped through the DB
 * (e.g. in the Review step and the final import route). */
export function safeTimeToMinutes(time: string): number | null {
  const trimmed = time.trim();
  if (!TIME_FORMAT.test(trimmed)) return null;
  const [hours, mins] = trimmed.split(":");
  const minutes = timeToMinutes(`${hours}:${mins}`);
  if (Number.isNaN(minutes) || minutes < 0 || minutes >= 24 * 60) return null;
  return minutes;
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
