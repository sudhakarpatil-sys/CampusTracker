import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { structureFromText, structureFromDocument } from "@/lib/timetable-import/ai-structure";
import { matchExistingSubject } from "@/lib/timetable-import/subject-matching";

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
  if (importRow.extraction_method === "pending")
    return NextResponse.json({ error: "Run extraction before structuring" }, { status: 409 });

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("branch, semester, academic_year, batch")
      .eq("id", user.id)
      .single();

    const context = {
      branch: profile?.branch ?? null,
      semester: profile?.semester ?? null,
      academicYear: profile?.academic_year ?? null,
      batch: profile?.batch ?? null,
    };

    const structured =
      importRow.extraction_method === "pdf_text" && importRow.raw_extracted_text
        ? await structureFromText(importRow.raw_extracted_text, context)
        : await (async () => {
            const { data: fileBlob, error: downloadError } = await supabase.storage
              .from("attachments")
              .download(importRow.file_path);
            if (downloadError || !fileBlob) throw new Error(downloadError?.message ?? "Couldn't read the uploaded file");
            const buffer = Buffer.from(await fileBlob.arrayBuffer());
            return structureFromDocument(buffer, importRow.mime_type, context);
          })();

    const { data: existingSubjects } = await supabase
      .from("subjects")
      .select("id, name, code")
      .eq("user_id", user.id)
      .eq("is_archived", false);

    const subjectsWithMatches = structured.subjects.map((subject) => ({
      ...subject,
      matched_subject_id: matchExistingSubject(subject.name, subject.code, existingSubjects ?? [])?.id ?? null,
    }));

    const { error: updateError } = await supabase
      .from("timetable_imports")
      .update({
        detected_branch: structured.detected.branch,
        detected_semester: structured.detected.semester,
        detected_academic_year: structured.detected.academic_year,
        detected_division: structured.detected.division,
        detection_confidence: structured.detection_confidence,
        extracted_payload: { subjects: subjectsWithMatches, slots: structured.slots },
      } as never)
      .eq("id", importRow.id);

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({
      subjects: subjectsWithMatches,
      slotCount: structured.slots.length,
      detected: structured.detected,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI structuring failed";
    await supabase
      .from("timetable_imports")
      .update({ status: "failed", failure_reason: message } as never)
      .eq("id", importRow.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
