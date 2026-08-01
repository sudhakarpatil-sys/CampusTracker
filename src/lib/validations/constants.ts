/**
 * Shared validation constants used by both client-side Zod schemas and
 * server-side API validation. Centralizes limits so they stay in sync.
 */

// ─────────────────────────────────────────────────────────────────────────
// String length limits
// ─────────────────────────────────────────────────────────────────────────

export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 5_000;
export const MAX_CONTENT_LENGTH = 50_000; // Notes content (Markdown)
export const MAX_NAME_LENGTH = 100;
export const MAX_CODE_LENGTH = 20;
export const MAX_VENUE_LENGTH = 200;
export const MAX_LOCATION_LENGTH = 200;
export const MAX_NOTES_LENGTH = 5_000;
export const MAX_SYLLABUS_LENGTH = 10_000;
export const MAX_FEEDBACK_LENGTH = 5_000;

// ─────────────────────────────────────────────────────────────────────────
// File upload limits
// ─────────────────────────────────────────────────────────────────────────

/** Maximum avatar image size in bytes (2 MB). */
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

/** Maximum timetable import file size in bytes (10 MB). */
export const MAX_IMPORT_FILE_SIZE = 10 * 1024 * 1024;

/** Maximum exam extraction file size in bytes (5 MB). */
export const MAX_EXAM_FILE_SIZE = 5 * 1024 * 1024;

/** Maximum feedback screenshot size in bytes (2 MB). */
export const MAX_FEEDBACK_SCREENSHOT_SIZE = 2 * 1024 * 1024;

/** Maximum note attachment size in bytes (5 MB). */
export const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────
// Allowed MIME types
// ─────────────────────────────────────────────────────────────────────────

export const AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const IMPORT_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"];
export const SCREENSHOT_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ATTACHMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// ─────────────────────────────────────────────────────────────────────────
// Numeric limits
// ─────────────────────────────────────────────────────────────────────────

export const MAX_SUBJECTS = 30;
export const MAX_TIMETABLE_SLOTS = 60;
export const MAX_NOTES_PER_USER = 500;
export const MAX_TASKS_PER_USER = 500;
export const MAX_EVENTS_PER_USER = 200;

// ─────────────────────────────────────────────────────────────────────────
// Regex patterns
// ─────────────────────────────────────────────────────────────────────────

/** Time format HH:MM or HH:MM:SS. */
export const TIME_PATTERN = /^\d{2}:\d{2}(:\d{2})?$/;

/** Date format YYYY-MM-DD. */
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
