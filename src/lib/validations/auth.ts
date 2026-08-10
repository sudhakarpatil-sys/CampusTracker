import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type SignupInput = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Detects whether an email belongs to a Faculty member, Administrator, or Student
 * based on institutional email patterns (e.g. faculty@, prof@, @faculty., @staff., HOD).
 */
export function detectRoleFromEmail(email?: string | null): "student" | "faculty" | "admin" {
  if (!email) return "student";
  const lower = email.toLowerCase();

  if (lower.includes("admin") || lower.includes("sysadmin")) {
    return "admin";
  }

  if (
    lower.includes("faculty") ||
    lower.includes("prof") ||
    lower.includes("teacher") ||
    lower.includes("hod") ||
    lower.includes("staff") ||
    lower.includes("instructor")
  ) {
    return "faculty";
  }

  return "student";
}
