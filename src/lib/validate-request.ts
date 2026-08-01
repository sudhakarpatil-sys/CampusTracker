/**
 * Server-side request validation helpers.
 *
 * Provides a consistent way to validate JSON bodies and file uploads
 * in API route handlers, returning typed data on success or throwing
 * an ApiError on failure.
 */

import { z } from "zod";
import { ApiError } from "@/lib/api-error";
import { sanitizeFileName } from "@/lib/sanitize";

// ─────────────────────────────────────────────────────────────────────────
// JSON body validation
// ─────────────────────────────────────────────────────────────────────────

/**
 * Parses a Request's JSON body against a Zod schema. Returns typed data
 * or throws `ApiError.validation()` with field-level details.
 *
 * ```ts
 * const data = await validateRequestBody(request, mySchema);
 * ```
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>,
): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw ApiError.validation("Request body must be valid JSON");
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const firstMessage = result.error.issues[0]?.message ?? "Invalid request data";
    throw ApiError.validation(firstMessage, fieldErrors);
  }

  return result.data;
}

// ─────────────────────────────────────────────────────────────────────────
// FormData validation
// ─────────────────────────────────────────────────────────────────────────

/**
 * Parses a Request's FormData and validates individual fields against
 * a Zod schema. Non-file fields are extracted as strings and validated.
 */
export async function validateFormData<T>(
  request: Request,
  schema: z.ZodSchema<T>,
): Promise<{ data: T; formData: FormData }> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    throw ApiError.validation("Request must be multipart form data");
  }

  // Extract non-file fields into a plain object for Zod validation.
  const fields: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") {
      fields[key] = value;
    }
  });

  const result = schema.safeParse(fields);
  if (!result.success) {
    const firstMessage = result.error.issues[0]?.message ?? "Invalid form data";
    throw ApiError.validation(firstMessage, result.error.flatten().fieldErrors);
  }

  return { data: result.data, formData };
}

// ─────────────────────────────────────────────────────────────────────────
// File upload validation
// ─────────────────────────────────────────────────────────────────────────

export interface FileValidationOptions {
  /** Maximum file size in bytes. */
  maxSizeBytes: number;
  /** Allowed MIME types. */
  allowedMimeTypes: string[];
  /** Whether the file is required (default: true). */
  required?: boolean;
}

export interface ValidatedFile {
  file: File;
  /** Sanitized filename, safe for storage paths. */
  safeName: string;
  /** File size in bytes. */
  sizeBytes: number;
  /** Validated MIME type. */
  mimeType: string;
}

/**
 * Validates a file from FormData. Returns a sanitized File with metadata
 * or throws ApiError for missing/too-large/wrong-type files.
 */
export function validateFileUpload(
  file: File | null,
  options: FileValidationOptions,
): ValidatedFile | null {
  const { maxSizeBytes, allowedMimeTypes, required = true } = options;

  if (!file || file.size === 0) {
    if (required) {
      throw ApiError.validation("File is required");
    }
    return null;
  }

  if (file.size > maxSizeBytes) {
    throw ApiError.fileTooLarge(Math.round(maxSizeBytes / (1024 * 1024)));
  }

  if (!allowedMimeTypes.includes(file.type)) {
    throw ApiError.unsupportedFileType(allowedMimeTypes);
  }

  return {
    file,
    safeName: sanitizeFileName(file.name) || "upload",
    sizeBytes: file.size,
    mimeType: file.type,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Auth guard helper
// ─────────────────────────────────────────────────────────────────────────

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Asserts that the request is authenticated. Returns the user or throws
 * `ApiError.unauthorized()`. Keeps route handlers concise.
 *
 * ```ts
 * const user = await requireAuth(supabase);
 * ```
 */
export async function requireAuth(supabase: SupabaseClient<Database>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw ApiError.unauthorized();
  }

  return user;
}
