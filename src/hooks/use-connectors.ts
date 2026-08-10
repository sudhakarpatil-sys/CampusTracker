"use client";

import * as React from "react";
import { useSupabaseCollection } from "@/hooks/use-supabase-collection";
import { toast } from "@/hooks/use-toast";
import type { SyncConnector, FieldMapping, SyncFrequency } from "@/types/sync";

export interface CreateConnectorInput {
  name: string;
  connectorType: "google_sheets" | "excel" | "csv" | "erp_api";
  config: Record<string, any>;
  fieldMappings?: FieldMapping[];
  syncFrequency?: SyncFrequency;
}

export function useConnectors(institutionId?: string) {
  const { data, isLoading, refetch, supabase, userId } = useSupabaseCollection<any>({
    table: "sync_connectors",
    orderBy: { column: "created_at", ascending: false },
    match: institutionId ? { institution_id: institutionId } : undefined,
  });

  const connectors: SyncConnector[] = React.useMemo(() => {
    return (data || []).map((row: any) => ({
      id: row.id,
      institutionId: row.institution_id,
      name: row.name,
      connectorType: row.connector_type,
      config: row.config || {},
      fieldMappings: row.field_mappings || [],
      syncFrequency: row.sync_frequency || "daily",
      isActive: row.is_active ?? true,
      lastSyncedAt: row.last_synced_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }, [data]);

  async function createConnector(input: CreateConnectorInput, targetInstId?: string) {
    const instId = targetInstId || institutionId;
    if (!instId) {
      toast({ title: "Institution missing", description: "Institution ID is required to add connector." });
      return { error: "Institution ID required" };
    }

    try {
      const res = await fetch("/api/sync/connectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionId: instId,
          name: input.name,
          connectorType: input.connectorType,
          config: input.config,
          fieldMappings: input.fieldMappings || [],
          syncFrequency: input.syncFrequency || "daily",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to create connector");
      }

      toast({ title: "Connector created", description: `Added '${input.name}' successfully.` });
      refetch();
      return { data: json.data, error: null };
    } catch (err: any) {
      toast({ title: "Creation failed", description: err.message });
      return { error: err.message };
    }
  }

  async function updateConnector(id: string, patch: Partial<SyncConnector>) {
    try {
      const res = await fetch(`/api/sync/connectors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update connector");
      }

      toast({ title: "Connector updated" });
      refetch();
      return { data: json.data, error: null };
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message });
      return { error: err.message };
    }
  }

  async function deleteConnector(id: string) {
    try {
      const res = await fetch(`/api/sync/connectors/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to delete connector");
      }

      toast({ title: "Connector removed" });
      refetch();
      return { error: null };
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message });
      return { error: err.message };
    }
  }

  async function testConnector(input: {
    connectorType?: string;
    config: Record<string, any>;
    fieldMappings?: FieldMapping[];
  }) {
    try {
      const res = await fetch("/api/sync/connectors/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Test connection failed");
      }

      return json.data;
    } catch (err: any) {
      return {
        isHealthy: false,
        status: "NETWORK_ERROR",
        message: err.message,
      };
    }
  }

  async function triggerManualSync(connectorId: string, instId?: string) {
    const targetInst = instId || institutionId;
    if (!targetInst) return { error: "Institution ID required" };

    try {
      toast({ title: "Sync triggered", description: "Executing synchronization job..." });

      const res = await fetch("/api/sync/jobs/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectorId,
          institutionId: targetInst,
          triggeredBy: "admin_manual",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to execute sync job");
      }

      const status = json.data?.job?.status;
      if (status === "completed") {
        toast({ title: "Sync completed", description: json.data?.message });
      } else {
        toast({ title: `Sync ${status}`, description: json.data?.message });
      }

      refetch();
      return { data: json.data, error: null };
    } catch (err: any) {
      toast({ title: "Sync failed", description: err.message });
      return { error: err.message };
    }
  }

  return {
    connectors,
    isLoading,
    createConnector,
    updateConnector,
    deleteConnector,
    testConnector,
    triggerManualSync,
    refetch,
  };
}
