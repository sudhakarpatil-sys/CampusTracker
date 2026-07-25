import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractPdfText, hasUsableTextLayer } from "@/lib/timetable-import/extract-text";

const ALLOWED_MIME_TYPES = new Set(["application/pdf", "image/png", "image/jpeg"]);

/**
 * Step 1 of the AI import pipeline: gets the uploaded document to a
 * usable text state. No AI call happens here — this is the deterministic
 * half. Milestone 4/5 reads `raw_extracted_text` (or, for
 * extraction_method "vision", the original file) to run AI structuring.
 */
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: importRow, error: fetchError } = await supabase
    .from("timetable_imports")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !importRow) {
    return NextResponse.json({ error: "Import not found" }, { status: 404 });
  }

  if (importRow.status !== "processing") {
    return NextResponse.json({ error: `Import is already ${importRow.status}` }, { status: 409 });
  }

  // Don't trust the client-supplied mime_type column at face value —
  // re-validate server-side before doing anything with the file.
  if (!ALLOWED_MIME_TYPES.has(importRow.mime_type)) {
    await supabase
      .from("timetable_imports")
      .update({ status: "failed", failure_reason: "Unsupported file type" } as never)
      .eq("id", importRow.id);
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  try {
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from("attachments")
      .download(importRow.file_path);

    if (downloadError || !fileBlob) {
      throw new Error(downloadError?.message ?? "Couldn't read the uploaded file");
    }

    const buffer = Buffer.from(await fileBlob.arrayBuffer());

    let extractionMethod: "pdf_text" | "vision" = "vision";
    let rawText: string | null = null;
    let pageCount = 1;

    if (importRow.mime_type === "application/pdf") {
      const { text, pageCount: extractedPageCount } = await extractPdfText(buffer);
      pageCount = extractedPageCount;
      if (hasUsableTextLayer(text, extractedPageCount)) {
        extractionMethod = "pdf_text";
        rawText = text;
      }
      // else: leave as "vision" — no usable text layer (scanned/photographed),
      // so the next milestone hands the original PDF to a vision-capable
      // model instead of trusting garbled text.
    }
    // PNG/JPG uploads have no text layer at all — always "vision".

    const { error: updateError } = await supabase
      .from("timetable_imports")
      .update({
        extraction_method: extractionMethod,
        raw_extracted_text: rawText,
        page_count: pageCount,
      } as never)
      .eq("id", importRow.id);

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ extractionMethod, pageCount });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Extraction failed";
    await supabase
      .from("timetable_imports")
      .update({ status: "failed", failure_reason: message } as never)
      .eq("id", importRow.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
