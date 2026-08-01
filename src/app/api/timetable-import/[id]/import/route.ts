import { createClient } from "@/lib/supabase/server";
import { withErrorHandler, createSuccessResponse, ApiError } from "@/lib/api-error";
import { standardRateLimiter } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/validate-request";
import { safeTimeToMinutes } from "@/lib/timetable-import/timetable-generation";

const SUBJECT_COLOR_PALETTE = ["#F5A623", "#4A90D9", "#7ED321", "#BD10E0", "#50E3C2", "#E94E77"];

interface ExtractedSubjectDetail {
  name: string;
  code: string | null;
  faculty_name: string | null;
  credits: number | null;
}

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
  if (importRow.status !== "needs_review") {
    throw ApiError.conflict(`Import is already ${importRow.status}`);
  }

  const { data: items, error: itemsError } = await supabase
    .from("timetable_import_items")
    .select("*")
    .eq("import_id", importRow.id)
    .eq("is_included", true);

  if (itemsError) {
    throw ApiError.internal(itemsError.message);
  }
  if (!items || items.length === 0) {
    throw ApiError.validation("No lectures are included — check at least one before importing");
  }

  // Defense in depth: the review screen already blocks this, but validate
  // again here so no path (a stale client, a future edit surface, bad
  // AI output) can ever surface the raw timetable_slots_time_order
  // constraint violation to the user instead of a clear message.
  const invalidItems = items.filter((item) => {
    const start = safeTimeToMinutes(item.start_time ?? "");
    const end = safeTimeToMinutes(item.end_time ?? "");
    return start === null || end === null || end <= start;
  });
  if (invalidItems.length > 0) {
    const details = invalidItems
      .map((item) => `${item.subject_name_raw} (${item.start_time}–${item.end_time})`)
      .join(", ");
    throw ApiError.validation(
      `${invalidItems.length} included lecture${invalidItems.length > 1 ? "s have" : " has"} an invalid time range and can't be imported: ${details}. Go back to Review and fix or exclude ${invalidItems.length > 1 ? "them" : "it"}.`,
    );
  }

  // Replace: archive every currently-active slot this student has —
  // not just ones tied to one specific prior import — since duplicates
  // can come from more than one source (a previous AI import, a manual
  // entry, or an earlier failed attempt). Archiving (never deleting)
  // means attendance_records keep their full timetable_slot_id link
  // and every historical day/time/faculty/room detail, forever.
  if (importRow.duplicate_resolution === "replace") {
    const { error: archiveError } = await supabase
      .from("timetable_slots")
      .update({ is_archived: true } as never)
      .eq("user_id", user.id)
      .eq("is_archived", false);
    if (archiveError) {
      throw ApiError.internal(`Couldn't archive the previous timetable: ${archiveError.message}`);
    }
    if (importRow.replaces_import_id) {
      await supabase
        .from("timetable_imports")
        .update({ status: "superseded", superseded_by: importRow.id } as never)
        .eq("id", importRow.replaces_import_id);
    }
  }

  const payload = importRow.extracted_payload as { subjects: ExtractedSubjectDetail[] } | null;
  const subjectDetailsByName = new Map((payload?.subjects ?? []).map((s) => [s.name, s]));

  const subjectIdByName = new Map<string, string>();
  const namesNeedingCreation = new Set<string>();

  for (const item of items) {
    if (item.matched_subject_id) {
      subjectIdByName.set(item.subject_name_raw, item.matched_subject_id);
    } else if (!subjectIdByName.has(item.subject_name_raw)) {
      namesNeedingCreation.add(item.subject_name_raw);
    }
  }

  let colorIndex = 0;
  for (const name of namesNeedingCreation) {
    const details = subjectDetailsByName.get(name);
    const { data: newSubject, error: insertSubjectError } = await supabase
      .from("subjects")
      .insert({
        user_id: user.id,
        name,
        code: details?.code ?? null,
        faculty_name: details?.faculty_name ?? null,
        credits: details?.credits ?? null,
        color: SUBJECT_COLOR_PALETTE[colorIndex % SUBJECT_COLOR_PALETTE.length],
        created_via: "ai_import",
        source_import_id: importRow.id,
      } as never)
      .select("id")
      .single();

    if (insertSubjectError || !newSubject) {
      throw ApiError.internal(insertSubjectError?.message ?? `Couldn't create subject "${name}"`);
    }
    subjectIdByName.set(name, (newSubject as { id: string }).id);
    colorIndex++;
  }

  const slotRows = items.map((item) => ({
    user_id: user.id,
    subject_id: subjectIdByName.get(item.subject_name_raw),
    day_of_week: item.day_of_week,
    start_time: item.start_time,
    end_time: item.end_time,
    classroom: item.classroom,
    source_import_id: importRow.id,
  }));

  const { error: slotsError } = await supabase.from("timetable_slots").insert(slotRows as never);
  if (slotsError) {
    throw ApiError.internal(slotsError.message);
  }

  const { error: statusError } = await supabase
    .from("timetable_imports")
    .update({ status: "imported" } as never)
    .eq("id", importRow.id);
  if (statusError) {
    throw ApiError.internal(statusError.message);
  }

  return createSuccessResponse({ subjectsCreated: namesNeedingCreation.size, slotsCreated: slotRows.length });
});
