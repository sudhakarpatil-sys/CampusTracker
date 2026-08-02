import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { aiStructuredTimetableSchema, type AiStructuredTimetable } from "@/lib/validations/timetable-import";

const MODEL_CANDIDATES = [
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

interface StudentContext {
  branch: string | null;
  semester: string | null;
  academicYear: string | null;
  batch: string | null;
}

function getGenAIClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "Gemini API key is invalid or not configured. Please get a free API key from Google AI Studio and add GEMINI_API_KEY to your environment variables."
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

function buildSystemPrompt({ branch, semester, academicYear }: StudentContext) {
  return `You read college timetable documents and convert them into strict JSON.

Students are instructed to upload only their own division's timetable, so
assume the document is already scoped to one class — extract every
lecture you find as-is, without trying to filter by division.

The document may still contain multiple branches or semesters if a
student accidentally uploaded a wider institute-wide sheet. The student's
own profile is: branch="${branch ?? "unknown"}", semester="${semester ?? "unknown"}",
academic_year="${academicYear ?? "unknown"}". If more than one branch or
semester is present, use only the block matching this student's branch
and semester; ignore the rest.

Expand common abbreviations using context (e.g. "AOA" -> "Analysis of
Algorithms", "DBMS" -> "Database Management Systems", "COA" -> "Computer
Organization & Architecture") when confident, otherwise keep the original
abbreviation as the name.

Additional parsing rules, based on real timetable formats:
- Ignore any column labeled "Short Break" or "Long Break" — these are
  structural, not lecture slots.
- If a subject code appears in the weekly grid but has no row in the
  course legend table, still include it as a subject (confidence "low" if
  nothing else is known about it, e.g. faculty_name null) rather than
  omitting it.
- A merged cell spanning two consecutive time columns (e.g. a lab from
  08:30-10:30 shown as one wide cell instead of two separate hour cells)
  is ONE slot with the full start_time/end_time span, not two — this
  applies even when that same merged cell also shows two parallel
  batches (see next rule).
- On the rare chance a cell shows two sub-batches running in parallel at
  the same time (e.g. one line tagged "(A1)" and another "(A2)", or
  similarly labeled halves of the same division doing different labs
  simultaneously in different rooms), emit BOTH as separate slot entries
  sharing the exact same day_of_week/start_time/end_time (using the full
  merged-cell span from the rule above). Set each one's "batch_label"
  field to that line's label with parentheses/spacing stripped (e.g.
  "(A1)" becomes "A1"). Do not try to guess which batch the student is
  in, and do not drop either line — report every batch variant you see
  exactly as shown; a separate deterministic step, not you, picks the
  correct one afterward. For any slot that is NOT part of a
  parallel-batch cell, set "batch_label" to null.

  Worked example: a Monday 08:30-10:30 cell reads:
    "SUBJ1 (A1) Faculty1 (Room1)
     SUBJ2 (A2) Faculty2 (Room2)"
  Emit TWO slots sharing day_of_week 1, start_time "08:30", end_time
  "10:30": one with subject_name expanded from "SUBJ1", faculty_name
  expanded/matched from "Faculty1", classroom "Room1", batch_label "A1";
  another with subject_name expanded from "SUBJ2", faculty_name from
  "Faculty2", classroom "Room2", batch_label "A2". Do NOT collapse these
  into one slot, do NOT pick just one, and do NOT split the 2-hour span
  into separate 1-hour entries.

Respond with ONLY JSON matching this exact shape — no markdown, no
commentary, no surrounding text:
{"detected":{"branch":string|null,"semester":string|null,"academic_year":string|null,"division":string|null},
"detection_confidence":{"branch":"high"|"medium"|"low","semester":"high"|"medium"|"low","academic_year":"high"|"medium"|"low","division":"high"|"medium"|"low"},
"subjects":[{"name":string,"code":string|null,"short_name":string|null,"faculty_name":string|null,"subject_type":"theory"|"lab"|"elective"|"other"|null,"credits":number|null,"confidence":"high"|"medium"|"low"}],
"slots":[{"subject_name":string,"day_of_week":1-7 (1=Monday, 7=Sunday),"start_time":"HH:MM","end_time":"HH:MM","faculty_name":string|null,"classroom":string|null,"lecture_type":"lecture"|"lab"|"tutorial"|"other"|null,"batch_label":string|null,"confidence":"high"|"medium"|"low"}]}

"division" in "detected" is informational only (include it if the
document happens to label one, e.g. a header showing "Division: A1") —
it is never used to filter content, since the student already uploaded
their own division's sheet.

Every "subject_name" in "slots" must exactly match a "name" in "subjects".
If a field can't be detected, use null and mark confidence "low" — never
omit a key.`;
}

function parseJsonResponse(raw: string): AiStructuredTimetable {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response did not contain a valid JSON object");
  }
  let jsonObject: unknown;
  try {
    jsonObject = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("AI response contained invalid JSON syntax");
  }
  const parsed = aiStructuredTimetableSchema.safeParse(jsonObject);
  if (!parsed.success) {
    console.error("Zod validation error:", parsed.error.format());
    throw new Error("AI response didn't match the expected format");
  }
  return parsed.data;
}

/** Free-tier rate limits (10–15 RPM) mean an occasional 429 is normal
 * under real usage, not a bug — a short backoff clears it. */
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const message = err instanceof Error ? err.message : "";
      if (!message.includes("429") || i === attempts - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** i));
    }
  }
  throw lastError;
}

async function executeGenerativeCall(
  context: StudentContext,
  payload: string | Part | (string | Part)[]
): Promise<string> {
  const genAI = getGenAIClient();
  let lastError: unknown;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: buildSystemPrompt(context),
        generationConfig: { responseMimeType: "application/json" },
      });
      const result = await withRetry(() => model.generateContent(payload as never));
      return result.response.text();
    } catch (err) {
      lastError = err;
      const message = err instanceof Error ? err.message : "";
      // If error is invalid API key, throw immediately instead of trying other models
      if (message.includes("401") || message.includes("API key")) {
        throw new Error("Gemini API key is invalid. Please update GEMINI_API_KEY with a valid key from Google AI Studio.");
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Could not process timetable with AI");
}

/** Text path: used when Milestone 3 found a usable PDF text layer. */
export async function structureFromText(rawText: string, context: StudentContext): Promise<AiStructuredTimetable> {
  const responseText = await executeGenerativeCall(context, `Timetable document text:\n\n${rawText}`);
  return parseJsonResponse(responseText);
}

/**
 * Vision path: no usable text layer (scanned PDF or photo), so the
 * original file is handed to the model directly instead of a separate
 * OCR engine — see Milestone 3's architecture note. Gemini reads PDFs
 * and images natively via inlineData.
 */
export async function structureFromDocument(
  fileBuffer: Buffer,
  mimeType: string,
  context: StudentContext
): Promise<AiStructuredTimetable> {
  const base64 = fileBuffer.toString("base64");
  const payload = [
    { inlineData: { mimeType, data: base64 } },
    { text: "Read this timetable document and respond with the JSON described in the system instructions." },
  ];
  const responseText = await executeGenerativeCall(context, payload);
  return parseJsonResponse(responseText);
}
