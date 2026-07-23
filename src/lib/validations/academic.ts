import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  code: z.string().optional(),
  facultyName: z.string().optional(),
  classroom: z.string().optional(),
  credits: z.coerce.number().min(0).optional(),
  attendanceTarget: z.coerce.number().min(0).max(100).default(75),
  color: z.string().min(1),
});
export type SubjectInput = z.infer<typeof subjectSchema>;

export const timetableSlotSchema = z
  .object({
    subjectId: z.string().min(1, "Select a subject"),
    dayOfWeek: z.coerce.number().min(1).max(7),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    facultyName: z.string().optional(),
    classroom: z.string().optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });
export type TimetableSlotInput = z.infer<typeof timetableSlotSchema>;

export const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subjectId: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["not_started", "in_progress", "submitted", "completed"]).default("not_started"),
  notes: z.string().optional(),
});
export type AssignmentInput = z.infer<typeof assignmentSchema>;

export const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subjectId: z.string().optional(),
  content: z.string().optional(),
});
export type NoteInput = z.infer<typeof noteSchema>;

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});
export type TaskInput = z.infer<typeof taskSchema>;

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["college", "workshop", "hackathon", "club", "personal"]).default("personal"),
  eventDate: z.string().min(1, "Date is required"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
});
export type EventInput = z.infer<typeof eventSchema>;

export const examSchema = z.object({
  subjectId: z.string().optional(),
  examDate: z.string().min(1, "Date is required"),
  examTime: z.string().optional(),
  venue: z.string().optional(),
  syllabus: z.string().optional(),
  preparationStatus: z.enum(["not_started", "in_progress", "ready"]).default("not_started"),
});
export type ExamInput = z.infer<typeof examSchema>;
