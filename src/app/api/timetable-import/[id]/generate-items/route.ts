import { createClient } from "@/lib/supabase/server";
import { withErrorHandler, createSuccessResponse, ApiError } from "@/lib/api-error";
import { standardRateLimiter } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/validate-request";
import { detectOverlaps } from "@/lib/timetable-import/timetable-generation";
import type { DetectedSubjectWithMatch, AiDetectedSlot } from "@/lib/validations/timetable-import";

export const POST = withErrorHandler(async (_request: Request, { params }: { params: { id: string } }) => {
  standardRateLimiter.check(_request);

  const supabase = createClient();
  const user = await requireAuth(supabase);

  const { data: importRow, error: fetchError } = await supabase
    .from("timetable_imports")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !importRow) {
    throw ApiError.notFound("Import");
  }
  if (importRow.status !== "processing") {
    throw ApiError.conflict(`Import is already ${importRow.status}`);
  }

  const payload = importRow.extracted_payload as { subjects: DetectedSubjectWithMatch[]; slots: AiDetectedSlot[] } | null;
  if (!payload) {
    throw ApiError.conflict("Run AI structuring before generating a timetable");
  }

  const normalized = detectOverlaps(payload.slots);
  const subjectByName = new Map(payload.subjects.map((s) => [s.name, s]));

  const itemRows = normalized.map((slot) => ({
    import_id: importRow.id,
    user_id: user.id,
    subject_name_raw: slot.subject_name,
    matched_subject_id: subjectByName.get(slot.subject_name)?.matched_subject_id ?? null,
    day_of_week: slot.isValid ? slot.day_of_week : null,
    start_time: slot.isValid ? slot.start_time : null,
    end_time: slot.isValid ? slot.end_time : null,
    faculty_name: slot.faculty_name,
    classroom: slot.classroom,
    confidence: slot.conflictReason ? "low" : slot.confidence,
    is_included: slot.isValid,
    conflict_reason: slot.conflictReason,
  }));

  // Replace any previously generated items for this import (safe to
  // call again if structuring re-runs).
  await supabase.from("timetable_import_items").delete().eq("import_id", importRow.id);

  const { error: insertError } = await supabase.from("timetable_import_items").insert(itemRows as never);
  if (insertError) {
    throw ApiError.internal(insertError.message);
  }

  const conflictCount = normalized.filter((s) => s.conflictReason).length;

  const { error: statusError } = await supabase
    .from("timetable_imports")
    .update({ status: "needs_review" } as never)
    .eq("id", importRow.id);
  if (statusError) {
    throw ApiError.internal(statusError.message);
  }

  return createSuccessResponse({ itemCount: itemRows.length, conflictCount });
});
