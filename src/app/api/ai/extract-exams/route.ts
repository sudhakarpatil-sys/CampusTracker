import { createClient } from "@/lib/supabase/server";
import { withErrorHandler, createSuccessResponse, ApiError } from "@/lib/api-error";
import { aiRateLimiter } from "@/lib/rate-limit";
import { requireAuth, validateFileUpload } from "@/lib/validate-request";

const MODEL = "gemini-3.1-flash-lite";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];

export const POST = withErrorHandler(async (request: Request) => {
  aiRateLimiter.check(request);

  const supabase = createClient();
  const user = await requireAuth(supabase);

  // Lazy-import to avoid loading the Gemini SDK for every cold start.
  const { GoogleGenerativeAI } = await import("@google/generative-ai");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw ApiError.internal("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const textContent = formData.get("text") as string | null;

  let promptContent: unknown[] = [];

  const systemPrompt = `You read college exam timetable / date sheet documents (PDFs, images, or raw text) and convert them into a strict JSON list of exams.
Extract every exam entry found in the document.

Respond ONLY with valid JSON matching this exact structure — no markdown, no code block backticks:
{
  "exams": [
    {
      "subject_name": "Exact or expanded subject name",
      "exam_date": "YYYY-MM-DD (format as 4-digit year, 2-digit month, 2-digit day. If year is missing assume current year)",
      "exam_time": "HH:MM in 24-hour format (e.g. 10:00 or 14:30) or null if unknown",
      "venue": "Examination hall, room number, or classroom string if mentioned, or null",
      "syllabus": "Modules, topics, or notes mentioned if any, or null"
    }
  ]
}`;

  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
    generationConfig: { responseMimeType: "application/json" },
  });

  if (file) {
    const validated = validateFileUpload(file, {
      maxSizeBytes: MAX_FILE_SIZE,
      allowedMimeTypes: ALLOWED_MIME_TYPES,
    });
    if (!validated) {
      throw ApiError.validation("Please upload an exam schedule file or paste text.");
    }

    const buffer = Buffer.from(await validated.file.arrayBuffer());
    const base64 = buffer.toString("base64");
    promptContent = [
      { inlineData: { mimeType: validated.mimeType, data: base64 } },
      { text: "Extract the exam schedule from this document into the JSON format described." },
    ];
  } else if (textContent) {
    if (textContent.trim().length === 0) {
      throw ApiError.validation("Text content cannot be empty.");
    }
    if (textContent.length > 50_000) {
      throw ApiError.validation("Text content is too long (max 50,000 characters).");
    }
    promptContent = [{ text: `Exam schedule text:\n\n${textContent}` }];
  } else {
    throw ApiError.validation("Please upload an exam schedule file or paste text.");
  }

  const result = await model.generateContent(promptContent as never);
  const rawJson = result.response.text().replace(/```json|```/g, "").trim();

  let parsed: { exams?: unknown[] };
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw ApiError.internal("AI returned invalid JSON. Please try again.");
  }

  // Suppress the "user" variable unused warning — it's used by requireAuth
  // for authentication and the variable is needed for future audit logging.
  void user;

  return createSuccessResponse({ exams: parsed.exams ?? [] });
});
