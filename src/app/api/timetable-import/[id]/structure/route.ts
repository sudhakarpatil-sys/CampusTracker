import { createClient } from "@/lib/supabase/server";
import { withErrorHandler, createSuccessResponse, ApiError } from "@/lib/api-error";
import { aiRateLimiter } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/validate-request";
import { structureFromText, structureFromDocument } from "@/lib/timetable-import/ai-structure";
import { matchExistingSubject } from "@/lib/timetable-import/subject-matching";
import { resolveBatchVariants } from "@/lib/timetable-import/batch-resolution";

export const POST = withErrorHandler(async (_request: Request, { params }: { params: { id: string } }) => {
  aiRateLimiter.check(_request);

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
  if (importRow.extraction_method === "pending") {
    throw ApiError.conflict("Run extraction before structuring");
  }

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
          if (downloadError || !fileBlob) {
            throw ApiError.internal(downloadError?.message ?? "Couldn't read the uploaded file");
          }
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

  // Deterministic step: the AI reports every parallel-batch variant it
  // sees (batch_label per slot); picking the one matching this
  // student's actual batch happens here, not in the prompt — see
  // batch-resolution.ts for why.
  const resolvedSlots = resolveBatchVariants(structured.slots, context.batch);

  const { error: updateError } = await supabase
    .from("timetable_imports")
    .update({
      detected_branch: structured.detected.branch,
      detected_semester: structured.detected.semester,
      detected_academic_year: structured.detected.academic_year,
      detected_division: structured.detected.division,
      detection_confidence: structured.detection_confidence,
      extracted_payload: { subjects: subjectsWithMatches, slots: resolvedSlots },
    } as never)
    .eq("id", importRow.id);

  if (updateError) {
    throw ApiError.internal(updateError.message);
  }

  return createSuccessResponse({
    subjects: subjectsWithMatches,
    slotCount: resolvedSlots.length,
    detected: structured.detected,
  });
});
