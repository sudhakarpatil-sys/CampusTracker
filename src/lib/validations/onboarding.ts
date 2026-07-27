import { z } from "zod";

export const onboardingSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  collegeName: z.string().min(2, "Enter your college name"),
  university: z.string().min(2, "Enter your university"),
  department: z.string().min(1, "Select a department"),
  branch: z.string().min(1, "Enter your branch"),
  semester: z.string().min(1, "Select a semester"),
  academicYear: z.string().min(4, "Enter your academic year, e.g. 2025-2026"),
  rollNumber: z.string().min(1, "Enter your roll number"),
  batch: z.string().optional(),
  avatarFile: z.instanceof(File).optional().nullable(),
});
export type OnboardingInput = z.infer<typeof onboardingSchema>;
