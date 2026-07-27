"use client";

import * as React from "react";
import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import type { TimetableImport } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";
import { timetableUploadSchema, type DetectedSubjectWithMatch } from "@/lib/validations/timetable-import";
import {
  findChecksumDuplicate,
  findContentDuplicate,
  countRecentUploads,
  MAX_UPLOADS_PER_DAY,
  type DuplicateCandidate,
} from "@/lib/timetable-import/duplicate-detection";

type UploadProgress = "idle" | "checking" | "uploading" | "saving" | "done";

async function computeChecksum(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Full client-side surface for the AI timetable import pipeline (Phase
 * 3A). Each async step wraps one API route from
 * src/app/api/timetable-import/[id]/*, keeping the hook a thin,
 * toast-and-refetch layer over them — matching every other Phase 2 hook's
 * shape in this file.
 */
export function useTimetableImport() {
  const { data, isLoading, refetch, supabase, userId } = useSupabaseCollection<TimetableImport>({
    table: "timetable_imports",
    orderBy: { column: "created_at", ascending: false },
  });

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<UploadProgress>("idle");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isStructuring, setIsStructuring] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);

  /** Phase 1: validate + checksum-check, without uploading anything yet,
   * so a duplicate decision can be shown before any Storage write or
   * daily-limit spend. */
  async function precheckUpload(file: File) {
    if (!userId) return { error: "Not signed in" as const, checksum: null, duplicate: null, rateLimited: false };

    const parsed = timetableUploadSchema.safeParse({ file });
    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message ?? "That file can't be used.";
      toast({ title: "Couldn't use that file", description: message });
      return { error: message, checksum: null, duplicate: null, rateLimited: false };
    }

    const recentCount = await countRecentUploads(supabase, userId);
    if (recentCount >= MAX_UPLOADS_PER_DAY) {
      const message = `You've hit today's limit of ${MAX_UPLOADS_PER_DAY} imports. Try again tomorrow.`;
      toast({ title: "Import limit reached", description: message });
      return { error: message, checksum: null, duplicate: null, rateLimited: true };
    }

    const checksum = await computeChecksum(file);
    const duplicate = await findChecksumDuplicate(supabase, userId, checksum);
    return { error: null, checksum, duplicate, rateLimited: false };
  }

  /** Phase 2: actually upload + create the row, once any duplicate
   * decision has been made (or there was none to make). */
  async function uploadTimetable(
    file: File,
    checksum: string,
    options?: { resolution: "replace" | "merge" | "new"; replacesImportId?: string }
  ) {
    if (!userId) return { error: "Not signed in", importId: null as string | null };

    setIsUploading(true);
    setUploadProgress("uploading");
    try {
      const importId = crypto.randomUUID();
      const filePath = `${userId}/timetable-imports/${importId}/${file.name}`;

      const { error: uploadError } = await supabase.storage.from("attachments").upload(filePath, file);
      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message });
        return { error: uploadError.message, importId: null as string | null };
      }

      setUploadProgress("saving");
      let versionNumber = 1;
      if (options?.replacesImportId) {
        const { data: priorVersion } = await supabase
          .from("timetable_imports")
          .select("version_number")
          .eq("id", options.replacesImportId)
          .single();
        versionNumber = ((priorVersion as { version_number: number } | null)?.version_number ?? 0) + 1;
      }

      const { error: insertError } = await supabase.from("timetable_imports").insert({
        id: importId,
        user_id: userId,
        file_path: filePath,
        original_filename: file.name,
        mime_type: file.type,
        file_size: file.size,
        checksum,
        status: "processing",
        version_number: versionNumber,
        replaces_import_id: options?.replacesImportId ?? null,
        duplicate_resolution: options?.resolution ?? "new",
      } as never);

      if (insertError) {
        await supabase.storage.from("attachments").remove([filePath]);
        toast({ title: "Couldn't start import", description: insertError.message });
        return { error: insertError.message, importId: null as string | null };
      }

      setUploadProgress("done");
      refetch();
      return { error: null, importId };
    } finally {
      setIsUploading(false);
    }
  }

  async function processImport(importId: string) {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/timetable-import/${importId}/process`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: "Couldn't read that file", description: json.error ?? "Extraction failed." });
        refetch();
        return { error: (json.error as string) ?? "Extraction failed" };
      }
      refetch();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Extraction failed";
      toast({ title: "Couldn't read that file", description: message });
      return { error: message };
    } finally {
      setIsProcessing(false);
    }
  }

  /** Also returns a possible content-based duplicate once AI has
   * detected branch/semester/division — this is the first point that
   * data exists to check it. */
  async function structureImport(importId: string) {
    setIsStructuring(true);
    try {
      const res = await fetch(`/api/timetable-import/${importId}/structure`, { method: "POST" });
      const json = await res.json();

      if (!res.ok) {
        toast({ title: "AI couldn't understand that file", description: json.error ?? "Structuring failed." });
        refetch();
        return { error: (json.error as string) ?? "Structuring failed", subjects: null, slotCount: 0, duplicate: null };
      }

      let duplicate: DuplicateCandidate | null = null;
      if (userId && json.detected) {
        duplicate = await findContentDuplicate(
          supabase,
          userId,
          json.detected.branch,
          json.detected.semester,
          importId
        );
      }

      refetch();
      return {
        error: null,
        subjects: json.subjects as DetectedSubjectWithMatch[],
        slotCount: json.slotCount as number,
        duplicate,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Structuring failed";
      toast({ title: "AI couldn't understand that file", description: message });
      return { error: message, subjects: null, slotCount: 0, duplicate: null };
    } finally {
      setIsStructuring(false);
    }
  }

  /** Records the student's duplicate decision when it's only discoverable
   * after AI structuring (content-based dup, not the earlier checksum one). */
  async function setDuplicateResolution(importId: string, resolution: "replace" | "merge" | "new", replacesImportId?: string) {
    await supabase
      .from("timetable_imports")
      .update({ duplicate_resolution: resolution, replaces_import_id: replacesImportId ?? null } as never)
      .eq("id", importId);
    refetch();
  }

  async function generateTimetableItems(importId: string) {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/timetable-import/${importId}/generate-items`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: "Couldn't build the timetable", description: json.error ?? "Generation failed." });
        refetch();
        return { error: (json.error as string) ?? "Generation failed", itemCount: 0, conflictCount: 0 };
      }
      refetch();
      return { error: null, itemCount: json.itemCount as number, conflictCount: json.conflictCount as number };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      toast({ title: "Couldn't build the timetable", description: message });
      return { error: message, itemCount: 0, conflictCount: 0 };
    } finally {
      setIsGenerating(false);
    }
  }

  async function importTimetable(importId: string) {
    setIsImporting(true);
    try {
      const res = await fetch(`/api/timetable-import/${importId}/import`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: "Couldn't complete the import", description: json.error ?? "Import failed." });
        refetch();
        return { error: (json.error as string) ?? "Import failed", subjectsCreated: 0, slotsCreated: 0 };
      }
      toast({ title: "Timetable imported!" });
      refetch();
      return { error: null, subjectsCreated: json.subjectsCreated as number, slotsCreated: json.slotsCreated as number };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Import failed";
      toast({ title: "Couldn't complete the import", description: message });
      return { error: message, subjectsCreated: 0, slotsCreated: 0 };
    } finally {
      setIsImporting(false);
    }
  }

  /** Re-runs extraction (and lets the caller chain structuring/generation
   * again) without re-uploading the file — used by the "Try again" button. */
  async function retryImport(importId: string) {
    await supabase.from("timetable_imports").update({ status: "processing", failure_reason: null } as never).eq("id", importId);
    refetch();
    return processImport(importId);
  }

  async function cancelImport(id: string) {
    const { error } = await supabase.from("timetable_imports").update({ status: "cancelled" } as never).eq("id", id);
    if (error) {
      toast({ title: "Couldn't cancel import", description: error.message });
      return;
    }
    refetch();
  }

  return {
    imports: data,
    isLoading,
    isUploading,
    uploadProgress,
    isProcessing,
    isStructuring,
    isGenerating,
    isImporting,
    precheckUpload,
    uploadTimetable,
    processImport,
    structureImport,
    setDuplicateResolution,
    generateTimetableItems,
    importTimetable,
    retryImport,
    cancelImport,
    refetch,
  };
}
