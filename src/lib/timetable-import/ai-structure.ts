import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiStructuredTimetableSchema, type AiStructuredTimetable } from "@/lib/validations/timetable-import";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

// Free-tier model — no card required via Google AI Studio. If you hit
// daily rate limits (250 req/day on Flash), "gemini-2.5-flash-lite" has a
// more generous free quota (~1,000 req/day) at slightly lower quality —
// a one-line swap here if needed.
const MODEL = "gemini-3.1-flash-lite";

interface StudentContext {
  branch: string | null;
  semester: string | null;
  academicYear: string | null;
}

function buildSystemPrompt({ branch, semester, academicYear }: StudentContext) {
  return `You read college timetable documents and convert them into strict JSON.

The document may contain multiple branches, semesters, or divisions on the
same page, or across multiple pages (e.g. one page per branch). The
student's own profile is: branch="${branch ?? "unknown"}",
semester="${semester ?? "unknown"}", academic_year="${academicYear ?? "unknown"}".
Find and use ONLY the block of the timetable that matches this student's
branch — ignore every other branch present in the document.

Expand common abbreviations using context (e.g. "AOA" -> "Analysis of
Algorithms", "DBMS" -> "Database Management Systems", "COA" -> "Computer
Organization & Architecture") when confident, otherwise keep the original
abbreviation as the name.

Additional parsing rules, based on real timetable formats:
- If a time cell contains multiple lines, each tagged with a different
  division in parentheses (e.g. "(A1)" vs "(A2)", or "(B1)" vs "(B2)"),
  these are SIMULTANEOUS parallel sessions for different divisions, not
  one combined class. If the student's division is known, keep only the
  line matching it and discard the others. If the division is unknown,
  include all of them but mark each with confidence "low" and set the
  slot's classroom/faculty from its own line only — never merge two
  divisions' details into one slot.
- Ignore any column labeled "Short Break" or "Long Break" — these are
  structural, not lecture slots.
- If a subject code appears in the weekly grid but has no row in the
  course legend table, still include it as a subject (confidence "low" if
  nothing else is known about it, e.g. faculty_name null) rather than
  omitting it.
- A merged cell spanning two consecutive time columns (e.g. a lab from
  08:30-10:30 shown as one wide cell instead of two separate hour cells)
  is ONE slot with the full start_time/end_time span, not two.

Respond with ONLY JSON matching this exact shape — no markdown, no
commentary, no surrounding text:
{"detected":{"branch":string|null,"semester":string|null,"academic_year":string|null,"division":string|null},
"detection_confidence":{"branch":"high"|"medium"|"low","semester":"high"|"medium"|"low","academic_year":"high"|"medium"|"low","division":"high"|"medium"|"low"},
"subjects":[{"name":string,"code":string|null,"short_name":string|null,"faculty_name":string|null,"subject_type":"theory"|"lab"|"elective"|"other"|null,"credits":number|null,"confidence":"high"|"medium"|"low"}],
"slots":[{"subject_name":string,"day_of_week":1-7 (1=Monday, 7=Sunday),"start_time":"HH:MM","end_time":"HH:MM","faculty_name":string|null,"classroom":string|null,"lecture_type":"lecture"|"lab"|"tutorial"|"other"|null,"confidence":"high"|"medium"|"low"}]}

Every "subject_name" in "slots" must exactly match a "name" in "subjects".
If a field can't be detected, use null and mark confidence "low" — never
omit a key.`;
}

function parseJsonResponse(raw: string): AiStructuredTimetable {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const parsed = aiStructuredTimetableSchema.safeParse(JSON.parse(cleaned));
  if (!parsed.success) throw new Error("AI response didn't match the expected format");
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

/** Text path: used when Milestone 3 found a usable PDF text layer. */
export async function structureFromText(rawText: string, context: StudentContext): Promise<AiStructuredTimetable> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: buildSystemPrompt(context),
    generationConfig: { responseMimeType: "application/json" },
  });

  const result = await withRetry(() => model.generateContent(`Timetable document text:\n\n${rawText}`));
  return parseJsonResponse(result.response.text());
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
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: buildSystemPrompt(context),
    generationConfig: { responseMimeType: "application/json" },
  });

  const base64 = fileBuffer.toString("base64");
  const result = await withRetry(() =>
    model.generateContent([
      { inlineData: { mimeType, data: base64 } },
      { text: "Read this timetable document and respond with the JSON described in the system instructions." },
    ])
  );
  return parseJsonResponse(result.response.text());
}
