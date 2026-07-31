import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const MODEL = "gemini-3.1-flash-lite";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
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
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mimeType = file.type || "application/pdf";
      promptContent = [
        { inlineData: { mimeType, data: base64 } },
        { text: "Extract the exam schedule from this document into the JSON format described." },
      ];
    } else if (textContent) {
      promptContent = [{ text: `Exam schedule text:\n\n${textContent}` }];
    } else {
      return NextResponse.json({ error: "Please upload an exam schedule file or paste text." }, { status: 400 });
    }

    const result = await model.generateContent(promptContent as never);
    const rawJson = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(rawJson);

    return NextResponse.json({ exams: parsed.exams || [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to extract exam schedule";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
