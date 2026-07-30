import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export interface DuplicateCandidate {
  id: string | null;
  original_filename: string;
  version_number: number;
  created_at: string;
  status: string;
}

/** Same file, uploaded before. Checked at upload time, before any
 * Storage write or AI call — the cheapest possible place to catch it. */
export async function findChecksumDuplicate(
  supabase: SupabaseClient<Database>,
  userId: string,
  checksum: string
): Promise<DuplicateCandidate | null> {
  const { data } = await supabase
    .from("timetable_imports")
    .select("id, original_filename, version_number, created_at, status")
    .eq("user_id", userId)
    .eq("checksum", checksum)
    .not("status", "in", "(cancelled,failed)")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as DuplicateCandidate | null) ?? null;
}

/** A student's currently active timetable — regardless of which import
 * (or manual entry) created each slot. Only checkable once we know
 * whether any active slots exist at all. */
export async function findActiveTimetableDuplicate(
  supabase: SupabaseClient<Database>,
  userId: string,
  excludeImportId: string
): Promise<DuplicateCandidate | null> {
  const { count } = await supabase
    .from("timetable_slots")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_archived", false);

  if (!count || count === 0) return null;

  // Prefer referencing the most recent successful AI import for the
  // dialog's filename/version display, if there is one.
  const { data: lastImport } = await supabase
    .from("timetable_imports")
    .select("id, original_filename, version_number, created_at, status")
    .eq("user_id", userId)
    .eq("status", "imported")
    .neq("id", excludeImportId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastImport) return lastImport as DuplicateCandidate;

  // Active slots exist but weren't traced to a specific prior AI import
  // (e.g. a hand-built timetable) — still worth asking, just without a
  // specific file/version to point to. `id: null` means Replace archives
  // by ownership (all of this user's active slots) rather than by a
  // specific source_import_id.
  return { id: null, original_filename: "your current timetable", version_number: 0, created_at: new Date().toISOString(), status: "imported" };
}

/** Lightweight cost guard for a free-tier AI provider — caps AI-call-
 * triggering uploads per student per day, complementing (not replacing)
 * Gemini's own per-minute rate limiting. */
export async function countRecentUploads(supabase: SupabaseClient<Database>, userId: string, hours = 24): Promise<number> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("timetable_imports")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);
  return count ?? 0;
}

export const MAX_UPLOADS_PER_DAY = 5;
