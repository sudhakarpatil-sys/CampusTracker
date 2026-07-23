import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  collegeName: z.string().min(2, "Enter your college name"),
  department: z.string().min(1, "Select a department"),
  branch: z.string().min(1, "Enter your branch"),
  semester: z.string().min(1, "Select a semester"),
  academicYear: z.string().min(4, "Enter your academic year"),
  rollNumber: z.string().min(1, "Enter your roll number"),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
