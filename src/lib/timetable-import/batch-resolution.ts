import type { AiDetectedSlot } from "@/lib/validations/timetable-import";

function normalizeBatchLabel(label: string): string {
  return label.trim().toLowerCase().replace(/[()\s]/g, "");
}

/**
 * Collapses AI-detected slots down to exactly one per (day, start, end)
 * timeslot, matching the student's own batch.
 *
 * This used to be asked of the AI directly ("pick the line matching this
 * student's batch"). Tested against a real 4-page multi-batch timetable,
 * it applied that rule correctly on some cells and incorrectly on
 * others within the same document — a known LLM weakness: repeating an
 * identical judgment call reliably many times in one long response.
 * A plain string comparison against a known profile value is something
 * deterministic code does with 100% consistency, so the AI's job changed
 * to "report every batch variant you see" (ai-structure.ts), and the
 * actual picking happens here instead.
 */
export function resolveBatchVariants(slots: AiDetectedSlot[], studentBatch: string | null): AiDetectedSlot[] {
  const groups = new Map<string, AiDetectedSlot[]>();
  for (const slot of slots) {
    const key = `${slot.day_of_week}|${slot.start_time}|${slot.end_time}`;
    groups.set(key, [...(groups.get(key) ?? []), slot]);
  }

  const resolved: AiDetectedSlot[] = [];
  for (const group of groups.values()) {
    if (group.length === 1) {
      resolved.push(group[0]!);
      continue;
    }

    // More than one slot at the identical day/time = parallel batch
    // options the AI was told to report separately rather than guess.
    const normalizedStudentBatch = studentBatch ? normalizeBatchLabel(studentBatch) : null;
    const match = normalizedStudentBatch
      ? group.find((s) => s.batch_label && normalizeBatchLabel(s.batch_label) === normalizedStudentBatch)
      : undefined;

    if (match) {
      resolved.push({ ...match, confidence: "high" });
    } else {
      // No known batch, or none of the reported options matched it —
      // fall back to the first option (stable, deterministic order),
      // flagged low-confidence so it's visibly reviewable rather than
      // silently possibly-wrong.
      resolved.push({ ...group[0]!, confidence: "low" });
    }
  }

  return resolved;
}
