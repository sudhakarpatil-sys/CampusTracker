import { z } from "zod";

export const ACCEPTED_TIMETABLE_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"] as const;

export const MAX_TIMETABLE_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export const timetableUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => (ACCEPTED_TIMETABLE_MIME_TYPES as readonly string[]).includes(f.type), {
      message: "Upload a PDF, PNG, or JPG file.",
    })
    .refine((f) => f.size <= MAX_TIMETABLE_FILE_SIZE_BYTES, {
      message: `File must be smaller than ${MAX_TIMETABLE_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
    }),
});
export type TimetableUploadInput = z.infer<typeof timetableUploadSchema>;

export const confidenceSchema = z.enum(["high", "medium", "low"]);

export const aiDetectedSubjectSchema = z.object({
  name: z.string(),
  code: z.string().nullish().transform((v) => v ?? null),
  short_name: z.string().nullish().transform((v) => v ?? null),
  faculty_name: z.string().nullish().transform((v) => v ?? null),
  subject_type: z.preprocess((val) => {
    if (typeof val === "string") {
      const lower = val.trim().toLowerCase();
      if (["theory", "lab", "elective", "other"].includes(lower)) return lower;
    }
    return null;
  }, z.enum(["theory", "lab", "elective", "other"]).nullable()),
  credits: z.preprocess((val) => (typeof val === "number" ? val : null), z.number().nullable()),
  confidence: z.preprocess((val) => {
    if (typeof val === "string" && ["high", "medium", "low"].includes(val.toLowerCase())) {
      return val.toLowerCase();
    }
    return "low";
  }, confidenceSchema),
});
export type AiDetectedSubject = z.infer<typeof aiDetectedSubjectSchema>;

export const aiDetectedSlotSchema = z.object({
  subject_name: z.string(),
  day_of_week: z.preprocess((val) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const num = parseInt(val, 10);
      if (!isNaN(num)) return num;
    }
    return 1;
  }, z.number().int().min(1).max(7)),
  start_time: z.string(),
  end_time: z.string(),
  faculty_name: z.string().nullish().transform((v) => v ?? null),
  classroom: z.string().nullish().transform((v) => v ?? null),
  lecture_type: z.preprocess((val) => {
    if (typeof val === "string") {
      const lower = val.trim().toLowerCase();
      if (["lecture", "lab", "tutorial", "other"].includes(lower)) return lower;
    }
    return null;
  }, z.enum(["lecture", "lab", "tutorial", "other"]).nullable()),
  batch_label: z.string().nullish().transform((v) => v ?? null),
  confidence: z.preprocess((val) => {
    if (typeof val === "string" && ["high", "medium", "low"].includes(val.toLowerCase())) {
      return val.toLowerCase();
    }
    return "low";
  }, confidenceSchema),
});
export type AiDetectedSlot = z.infer<typeof aiDetectedSlotSchema>;

export const aiStructuredTimetableSchema = z.object({
  detected: z
    .object({
      branch: z.string().nullish().transform((v) => v ?? null),
      semester: z.string().nullish().transform((v) => v ?? null),
      academic_year: z.string().nullish().transform((v) => v ?? null),
      division: z.string().nullish().transform((v) => v ?? null),
    })
    .optional()
    .default({ branch: null, semester: null, academic_year: null, division: null }),
  detection_confidence: z
    .object({
      branch: confidenceSchema.optional().default("low"),
      semester: confidenceSchema.optional().default("low"),
      academic_year: confidenceSchema.optional().default("low"),
      division: confidenceSchema.optional().default("low"),
    })
    .optional()
    .default({ branch: "low", semester: "low", academic_year: "low", division: "low" }),
  subjects: z.array(aiDetectedSubjectSchema).optional().default([]),
  slots: z.array(aiDetectedSlotSchema).optional().default([]),
});
export type AiStructuredTimetable = z.infer<typeof aiStructuredTimetableSchema>;

export interface DetectedSubjectWithMatch extends AiDetectedSubject {
  matched_subject_id: string | null;
}
