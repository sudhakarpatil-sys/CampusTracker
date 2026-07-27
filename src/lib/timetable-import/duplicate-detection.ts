import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export interface DuplicateCandidate {
  id: string;
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

/** Different file, same academic content already imported (e.g. a
 * revised timetable for the same branch/semester). Scoped to this
 * student's own imports already, so division isn't needed as a filter —
 * a student only ever uploads their own division's sheet. Only checkable
 * once AI structuring has run. */
export async function findContentDuplicate(
  supabase: SupabaseClient<Database>,
  userId: string,
  branch: string | null,
  semester: string | null,
  excludeImportId: string
): Promise<DuplicateCandidate | null> {
  if (!branch || !semester) return null;

  const { data } = await supabase
    .from("timetable_imports")
    .select("id, original_filename, version_number, created_at, status")
    .eq("user_id", userId)
    .eq("status", "imported")
    .eq("detected_branch", branch)
    .eq("detected_semester", semester)
    .neq("id", excludeImportId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as DuplicateCandidate | null) ?? null;
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
