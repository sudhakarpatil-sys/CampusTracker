"use client";

import * as React from "react";
import {
  Link2,
  Plus,
  RefreshCw,
  Power,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConnectorWizard } from "@/components/admin/connector-wizard";
import { useConnectors } from "@/hooks/use-connectors";
import { cn, formatDate } from "@/lib/utils";

const HEALTH_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  CONNECTED: { label: "Connected", bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400" },
  SYNCING: { label: "Syncing", bg: "bg-indigo-500/10 border-indigo-500/30", text: "text-indigo-600 dark:text-indigo-400" },
  DISCONNECTED: { label: "Disconnected", bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-600 dark:text-slate-400" },
  AUTH_FAILED: { label: "Auth Failed", bg: "bg-rose-500/10 border-rose-500/30", text: "text-rose-600 dark:text-rose-400" },
  SHEET_NOT_FOUND: { label: "Sheet Not Found", bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  PERMISSION_DENIED: { label: "Permission Denied", bg: "bg-rose-500/10 border-rose-500/30", text: "text-rose-600 dark:text-rose-400" },
  RATE_LIMITED: { label: "Rate Limited", bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  RETRYING: { label: "Retrying", bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-600 dark:text-purple-400" },
};

export function ConnectorDashboardContent() {
  const { connectors, isLoading, createConnector, updateConnector, deleteConnector, triggerManualSync, testConnector } = useConnectors();
  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [testingId, setTestingId] = React.useState<string | null>(null);

  async function handleTest(conn: any) {
    setTestingId(conn.id);
    const res = await testConnector({
      connectorType: conn.connectorType,
      config: conn.config,
      fieldMappings: conn.fieldMappings,
    });
    setTestingId(null);

    // Update connector status in database based on test
    const newStatus = res.isHealthy ? "CONNECTED" : (res.status || "DISCONNECTED");
    await updateConnector(conn.id, {
      config: { ...conn.config, healthStatus: newStatus },
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Academic Connector Console
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure live Google Sheets & dataset adapters for official institutional data ingestion.
          </p>
        </div>
        <Button
          onClick={() => setWizardOpen(true)}
          className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white shadow-sm"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add Google Sheet Connector
        </Button>
      </div>

      {/* Connectors Grid */}
      {connectors.length === 0 ? (
        <EmptyState
          icon={Link2}
          title="No connectors configured"
          description="Connect your institution's Google Sheets or spreadsheets to begin syncing attendance and student master data."
          action={
            <Button onClick={() => setWizardOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Configure First Connector
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {connectors.map((conn) => {
            const statusKey = conn.config?.healthStatus || "CONNECTED";
            const health = HEALTH_BADGES[statusKey] || HEALTH_BADGES.CONNECTED || { label: "Connected", bg: "bg-emerald-500/10", text: "text-emerald-500" };
            const isTesting = testingId === conn.id;

            return (
              <Card key={conn.id} className="glass-shelf flex flex-col justify-between overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-base font-semibold text-foreground">{conn.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize font-mono mt-0.5">
                        {conn.connectorType.replace("_", " ")} · {conn.config?.datasetType || "student_master"}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("shrink-0 text-[10px] uppercase font-semibold", health.bg, health.text)}>
                      {health.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pb-4">
                  {/* Source details */}
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-2.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Sync frequency:</span>
                      <span className="font-medium text-foreground capitalize">{conn.syncFrequency}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Field mappings:</span>
                      <span className="font-medium text-foreground font-mono">{conn.fieldMappings.length} columns</span>
                    </div>
                    {conn.lastSyncedAt && (
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Last synced:</span>
                        <span className="font-medium text-foreground">{formatDate(conn.lastSyncedAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTest(conn)}
                      disabled={isTesting}
                      className="flex-1 h-8 text-xs gap-1"
                    >
                      <RefreshCw className={cn("h-3 w-3", isTesting && "animate-spin")} />
                      {isTesting ? "Testing..." : "Test"}
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => triggerManualSync(conn.id, conn.institutionId)}
                      className="flex-1 h-8 text-xs bg-indigo-600 text-white hover:bg-indigo-700 gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Sync Now
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateConnector(conn.id, { isActive: !conn.isActive })}
                      title={conn.isActive ? "Disable Connector" : "Enable Connector"}
                      className={cn("h-8 w-8", conn.isActive ? "text-emerald-500" : "text-muted-foreground")}
                    >
                      <Power className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteConnector(conn.id)}
                      title="Delete Connector"
                      className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Setup Wizard */}
      <ConnectorWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onSubmit={createConnector}
      />
    </div>
  );
}
