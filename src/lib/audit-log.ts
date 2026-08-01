/**
 * Audit logging utility.
 *
 * Writes to the `audit_logs` table to track user actions.
 * Fires and forgets — never blocks the user action it's logging.
 *
 * Usage:
 * ```ts
 * import { logAuditEvent } from "@/lib/audit-log";
 *
 * await logAuditEvent(supabase, userId, {
 *   action: "attendance.mark",
 *   entityType: "attendance_records",
 *   entityId: recordId,
 *   metadata: { status: "present", subjectId },
 * });
 * ```
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// ─────────────────────────────────────────────────────────────────────────
// Audit action constants
// ─────────────────────────────────────────────────────────────────────────

export const AuditAction = {
  // Auth events
  AUTH_LOGIN: "auth.login",
  AUTH_LOGOUT: "auth.logout",
  AUTH_PASSWORD_CHANGE: "auth.password_change",

  // Profile
  PROFILE_UPDATE: "profile.update",
  AVATAR_UPLOAD: "profile.avatar_upload",

  // Academic data
  SUBJECT_CREATE: "subject.create",
  SUBJECT_UPDATE: "subject.update",
  SUBJECT_DELETE: "subject.delete",

  TIMETABLE_SLOT_CREATE: "timetable_slot.create",
  TIMETABLE_SLOT_UPDATE: "timetable_slot.update",
  TIMETABLE_SLOT_DELETE: "timetable_slot.delete",

  TIMETABLE_IMPORT: "timetable.import",

  ATTENDANCE_MARK: "attendance.mark",

  ASSIGNMENT_CREATE: "assignment.create",
  ASSIGNMENT_UPDATE: "assignment.update",
  ASSIGNMENT_DELETE: "assignment.delete",
  ASSIGNMENT_ARCHIVE: "assignment.archive",

  NOTE_CREATE: "note.create",
  NOTE_UPDATE: "note.update",
  NOTE_DELETE: "note.delete",

  TASK_CREATE: "task.create",
  TASK_UPDATE: "task.update",
  TASK_DELETE: "task.delete",
  TASK_COMPLETE: "task.complete",

  EVENT_CREATE: "event.create",
  EVENT_UPDATE: "event.update",
  EVENT_DELETE: "event.delete",

  EXAM_CREATE: "exam.create",
  EXAM_UPDATE: "exam.update",
  EXAM_DELETE: "exam.delete",

  // Settings
  SETTINGS_THEME: "settings.theme",
  SETTINGS_NOTIFICATIONS: "settings.notifications",
  SETTINGS_TIMETABLE: "settings.timetable",

  // Feedback
  FEEDBACK_SUBMIT: "feedback.submit",
} as const;

export type AuditActionType = (typeof AuditAction)[keyof typeof AuditAction];

// ─────────────────────────────────────────────────────────────────────────
// Logging function
// ─────────────────────────────────────────────────────────────────────────

interface AuditEventPayload {
  action: AuditActionType;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Logs an audit event. This is fire-and-forget — errors are caught
 * and logged to the console but never propagated to the caller.
 */
export async function logAuditEvent(
  supabase: SupabaseClient<Database>,
  userId: string,
  payload: AuditEventPayload,
): Promise<void> {
  try {
    await (supabase as any).from("audit_logs").insert({ // eslint-disable-line
      user_id: userId,
      action: payload.action,
      entity_type: payload.entityType,
      entity_id: payload.entityId ?? null,
      metadata: payload.metadata ?? {},
    });
  } catch (err) {
    // Never let audit logging break the user action.
    // eslint-disable-next-line no-console
    console.error("[Audit] Failed to log event:", err);
  }
}

/**
 * Client-side audit logger — uses the browser Supabase client.
 * Convenience wrapper for hooks that already have userId.
 */
export function createAuditLogger(supabase: SupabaseClient<Database>, userId: string) {
  return (payload: AuditEventPayload) => logAuditEvent(supabase, userId, payload);
}
