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
  code: z.string().nullable(),
  short_name: z.string().nullable(),
  faculty_name: z.string().nullable(),
  subject_type: z.enum(["theory", "lab", "elective", "other"]).nullable(),
  credits: z.number().nullable(),
  confidence: confidenceSchema,
});
export type AiDetectedSubject = z.infer<typeof aiDetectedSubjectSchema>;

export const aiDetectedSlotSchema = z.object({
  subject_name: z.string(), // must match a `name` in aiDetectedSubjectSchema
  day_of_week: z.number().int().min(1).max(7), // 1 = Monday ... 7 = Sunday, matching timetable_slots
  start_time: z.string(),
  end_time: z.string(),
  faculty_name: z.string().nullable(),
  classroom: z.string().nullable(),
  lecture_type: z.enum(["lecture", "lab", "tutorial", "other"]).nullable(),
  confidence: confidenceSchema,
});
export type AiDetectedSlot = z.infer<typeof aiDetectedSlotSchema>;

export const aiStructuredTimetableSchema = z.object({
  detected: z.object({
    branch: z.string().nullable(),
    semester: z.string().nullable(),
    academic_year: z.string().nullable(),
    division: z.string().nullable(),
  }),
  detection_confidence: z.object({
    branch: confidenceSchema,
    semester: confidenceSchema,
    academic_year: confidenceSchema,
    division: confidenceSchema,
  }),
  subjects: z.array(aiDetectedSubjectSchema),
  slots: z.array(aiDetectedSlotSchema),
});
export type AiStructuredTimetable = z.infer<typeof aiStructuredTimetableSchema>;

export interface DetectedSubjectWithMatch extends AiDetectedSubject {
  matched_subject_id: string | null;
}
