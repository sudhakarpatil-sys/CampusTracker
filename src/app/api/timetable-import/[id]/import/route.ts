import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SUBJECT_COLOR_PALETTE = ["#F5A623", "#4A90D9", "#7ED321", "#BD10E0", "#50E3C2", "#E94E77"];

interface ExtractedSubjectDetail {
  name: string;
  code: string | null;
  faculty_name: string | null;
  credits: number | null;
}

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
  if (importRow.status !== "needs_review")
    return NextResponse.json({ error: `Import is already ${importRow.status}` }, { status: 409 });

  const { data: items, error: itemsError } = await supabase
    .from("timetable_import_items")
    .select("*")
    .eq("import_id", importRow.id)
    .eq("is_included", true);

  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });
  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: "No lectures are included — check at least one before importing" },
      { status: 400 }
    );
  }

  try {
    // Replace: clear only the slots this specific prior import produced,
    // never a blanket delete — manually-added lectures are untouched.
    if (importRow.duplicate_resolution === "replace" && importRow.replaces_import_id) {
      const { error: deleteSlotsError } = await supabase
        .from("timetable_slots")
        .delete()
        .eq("source_import_id", importRow.replaces_import_id);
      if (deleteSlotsError) {
        throw new Error(`Couldn't clear the previous version: ${deleteSlotsError.message}`);
      }
      await supabase
        .from("timetable_imports")
        .update({ status: "superseded", superseded_by: importRow.id } as never)
        .eq("id", importRow.replaces_import_id);
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
        throw new Error(insertSubjectError?.message ?? `Couldn't create subject "${name}"`);
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
    if (slotsError) throw new Error(slotsError.message);

    const { error: statusError } = await supabase
      .from("timetable_imports")
      .update({ status: "imported" } as never)
      .eq("id", importRow.id);
    if (statusError) throw new Error(statusError.message);

    return NextResponse.json({ subjectsCreated: namesNeedingCreation.size, slotsCreated: slotRows.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed";
    await supabase
      .from("timetable_imports")
      .update({ status: "failed", failure_reason: message } as never)
      .eq("id", importRow.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
