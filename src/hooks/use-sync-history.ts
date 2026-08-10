"use client";

import * as React from "react";
import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import { toast } from "@/hooks/use-toast";
import type { SyncJob, SyncQuarantineRow } from "@/types/sync";

export function useSyncHistory(institutionId?: string) {
  const { data: jobsData, isLoading: isJobsLoading, refetch: refetchJobs } = useSupabaseCollection<any>({
    table: "sync_jobs",
    orderBy: { column: "started_at", ascending: false },
    match: institutionId ? { institution_id: institutionId } : undefined,
  });

  const { data: quarantineData, isLoading: isQuarantineLoading, refetch: refetchQuarantine } = useSupabaseCollection<any>({
    table: "sync_quarantine_rows",
    orderBy: { column: "created_at", ascending: false },
    match: institutionId ? { institution_id: institutionId } : undefined,
  });

  const { data: retriesData, isLoading: isRetriesLoading, refetch: refetchRetries } = useSupabaseCollection<any>({
    table: "retry_queue",
    orderBy: { column: "created_at", ascending: false },
    match: institutionId ? { institution_id: institutionId } : undefined,
  });

  const syncJobs: SyncJob[] = React.useMemo(() => {
    return (jobsData || []).map((row: any) => ({
      id: row.id,
      connectorId: row.connector_id,
      institutionId: row.institution_id,
      status: row.status,
      triggeredBy: row.triggered_by,
      processedRows: row.processed_rows || 0,
      insertedRows: row.inserted_rows || 0,
      updatedRows: row.updated_rows || 0,
      quarantinedRows: row.quarantined_rows || 0,
      errorLog: row.error_log,
      executionTimeMs: row.execution_time_ms,
      startedAt: row.started_at,
      completedAt: row.completed_at,
    }));
  }, [jobsData]);

  const quarantineRows: SyncQuarantineRow[] = React.useMemo(() => {
    return (quarantineData || []).map((row: any) => ({
      id: row.id,
      syncJobId: row.sync_job_id,
      institutionId: row.institution_id,
      rawData: row.raw_data || {},
      failureReason: row.failure_reason,
      isResolved: row.is_resolved ?? false,
      resolvedAt: row.resolved_at,
      createdAt: row.created_at,
    }));
  }, [quarantineData]);

  const retryItems = React.useMemo(() => {
    return (retriesData || []).map((row: any) => ({
      id: row.id,
      connectorId: row.connector_id,
      institutionId: row.institution_id,
      attemptCount: row.attempt_count || 0,
      nextRetryAt: row.next_retry_at,
      errorReason: row.error_reason,
      status: row.status,
      createdAt: row.created_at,
    }));
  }, [retriesData]);

  async function resolveQuarantineRow(id: string) {
    try {
      const res = await fetch("/api/sync/quarantine", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quarantineId: id, isResolved: true }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to resolve quarantine row");
      }

      toast({ title: "Quarantine row resolved" });
      refetchQuarantine();
      return { error: null };
    } catch (err: any) {
      toast({ title: "Resolution failed", description: err.message });
      return { error: err.message };
    }
  }

  async function executeRetry(retryId: string) {
    try {
      toast({ title: "Retry initiated", description: "Running sync retry job..." });

      const res = await fetch("/api/sync/retries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retryId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to execute retry");
      }

      toast({ title: "Retry finished", description: json.data?.message });
      refetchJobs();
      refetchRetries();
      return { data: json.data, error: null };
    } catch (err: any) {
      toast({ title: "Retry failed", description: err.message });
      return { error: err.message };
    }
  }

  return {
    syncJobs,
    quarantineRows,
    retryItems,
    isLoading: isJobsLoading || isQuarantineLoading || isRetriesLoading,
    resolveQuarantineRow,
    executeRetry,
    refetchJobs,
    refetchQuarantine,
    refetchRetries,
  };
}
