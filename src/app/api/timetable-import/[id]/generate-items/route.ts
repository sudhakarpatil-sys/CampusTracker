import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { detectOverlaps } from "@/lib/timetable-import/timetable-generation";
import type { DetectedSubjectWithMatch, AiDetectedSlot } from "@/lib/validations/timetable-import";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: importRow, error: fetchError } = await supabase
    .from("timetable_imports")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !importRow) return NextResponse.json({ error: "Import not found" }, { status: 404 });
  if (importRow.status !== "processing")
    return NextResponse.json({ error: `Import is already ${importRow.status}` }, { status: 409 });

  const payload = importRow.extracted_payload as { subjects: DetectedSubjectWithMatch[]; slots: AiDetectedSlot[] } | null;
  if (!payload) return NextResponse.json({ error: "Run AI structuring before generating a timetable" }, { status: 409 });

  try {
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
    if (insertError) throw new Error(insertError.message);

    const conflictCount = normalized.filter((s) => s.conflictReason).length;

    const { error: statusError } = await supabase
      .from("timetable_imports")
      .update({ status: "needs_review" } as never)
      .eq("id", importRow.id);
    if (statusError) throw new Error(statusError.message);

    return NextResponse.json({ itemCount: itemRows.length, conflictCount });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Timetable generation failed";
    await supabase
      .from("timetable_imports")
      .update({ status: "failed", failure_reason: message } as never)
      .eq("id", importRow.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
