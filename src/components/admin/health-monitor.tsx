"use client";

import * as React from "react";
import { HeartPulse, CheckCircle2, AlertTriangle, RefreshCw, Activity, Zap, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useConnectors } from "@/hooks/use-connectors";
import { cn, formatDate } from "@/lib/utils";

export function HealthMonitorContent() {
  const { connectors, isLoading, testConnector, refetch } = useConnectors();
  const [testingId, setTestingId] = React.useState<string | null>(null);

  async function handleHealthCheckAll() {
    for (const conn of connectors) {
      setTestingId(conn.id);
      await testConnector({
        connectorType: conn.connectorType,
        config: conn.config,
        fieldMappings: conn.fieldMappings,
      });
    }
    setTestingId(null);
    refetch();
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Connector Health & Diagnostics
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time status pulse indicators, latency metrics, and API source connectivity monitoring.
          </p>
        </div>
        <Button
          onClick={handleHealthCheckAll}
          disabled={!!testingId}
          className="bg-indigo-600 text-white hover:bg-indigo-700 h-9 gap-1.5 text-xs shadow-sm"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", testingId && "animate-spin")} />
          {testingId ? "Running Diagnostics..." : "Check All Connectors"}
        </Button>
      </div>

      {/* Health Matrix Grid */}
      {connectors.length === 0 ? (
        <EmptyState
          icon={HeartPulse}
          title="No connectors to monitor"
          description="Configure Google Sheets or academic connectors to monitor live health statuses."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {connectors.map((conn) => {
            const healthStatus = conn.config?.healthStatus || "CONNECTED";
            const isHealthy = healthStatus === "CONNECTED";

            return (
              <Card key={conn.id} className="glass-shelf overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Pulse Indicator */}
                      <span className="relative flex h-3 w-3">
                        <span className={cn(
                          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                          isHealthy ? "bg-emerald-400" : "bg-rose-400"
                        )} />
                        <span className={cn(
                          "relative inline-flex h-3 w-3 rounded-full",
                          isHealthy ? "bg-emerald-500" : "bg-rose-500"
                        )} />
                      </span>
                      <h3 className="font-semibold text-sm text-foreground truncate">{conn.name}</h3>
                    </div>
                    <Badge
                      variant={isHealthy ? "secondary" : "destructive"}
                      className="text-[9px] uppercase font-mono px-2 py-0.5"
                    >
                      {healthStatus}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pb-4 text-xs">
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Connector Type:</span>
                      <span className="text-foreground capitalize">{conn.connectorType}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Polling Schedule:</span>
                      <span className="text-foreground capitalize">{conn.syncFrequency}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Last Health Ping:</span>
                      <span className="text-foreground">{conn.updatedAt ? formatDate(conn.updatedAt) : "—"}</span>
                    </div>
                  </div>

                  {!isHealthy && conn.config?.lastErrorMessage && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-[11px] text-rose-600 dark:text-rose-400 flex items-start gap-2">
                      <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{conn.config.lastErrorMessage}</span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testConnector({ connectorType: conn.connectorType, config: conn.config, fieldMappings: conn.fieldMappings })}
                    className="w-full h-8 text-xs gap-1.5"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-500" /> Run Direct Diagnostic
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
