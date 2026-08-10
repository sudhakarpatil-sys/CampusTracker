"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Link2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Activity,
  RotateCcw,
  AlertOctagon,
  ShieldCheck,
  Building2,
  Database,
  ArrowUpRight,
  Clock,
  HeartPulse,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useConnectors } from "@/hooks/use-connectors";
import { useSyncHistory } from "@/hooks/use-sync-history";
import { cn, formatDate } from "@/lib/utils";

export function AdminDashboardContent() {
  const { connectors, isLoading: isConnectorsLoading, triggerManualSync } = useConnectors();
  const { syncJobs, retryItems, isLoading: isSyncLoading } = useSyncHistory();

  const isLoading = isConnectorsLoading || isSyncLoading;

  const totalConnectors = connectors.length;
  const activeConnectors = connectors.filter((c) => c.isActive).length;
  const failedConnectors = connectors.filter(
    (c) => c.config?.healthStatus && c.config.healthStatus !== "CONNECTED"
  ).length;

  const recentJobs = syncJobs.slice(0, 5);
  const pendingRetries = retryItems.filter((r) => r.status === "pending").length;

  const lastSuccessfulSync = React.useMemo(() => {
    const successful = syncJobs.filter((j) => j.status === "completed");
    const first = successful[0];
    if (successful.length === 0 || !first) return null;
    return first.completedAt || first.startedAt;
  }, [syncJobs]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Admin Console Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Academic Data Sync Engine, Connector Health, and Multi-Tenant Controls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={"/admin/sync-activity" as any}>
              <Activity className="mr-1.5 h-4 w-4" /> Activity Log
            </Link>
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm" asChild>
            <Link href={"/admin/connectors" as any}>
              <Link2 className="mr-1.5 h-4 w-4" /> Manage Connectors
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-shelf relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Configured Connectors
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Link2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-foreground">{totalConnectors}</span>
              <span className="text-xs text-muted-foreground">({activeConnectors} active)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-shelf relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                System Health
              </span>
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl",
                failedConnectors > 0 ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
              )}>
                <HeartPulse className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-foreground">
                {failedConnectors > 0 ? "Degraded" : "Optimal"}
              </span>
              {failedConnectors > 0 && (
                <Badge variant="destructive" className="text-[10px]">
                  {failedConnectors} issue{failedConnectors !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-shelf relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Last Successful Sync
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="font-mono text-sm font-semibold text-foreground">
                {lastSuccessfulSync ? formatDate(lastSuccessfulSync) : "No syncs run yet"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">Automated polling active</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-shelf relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Retries
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <RotateCcw className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-foreground">{pendingRetries}</span>
              <span className="text-xs text-muted-foreground">jobs queued</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Overview Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Connectors Summary */}
        <Card className="glass-shelf lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Active Academic Connectors</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link href={"/admin/connectors" as any}>
                View all ({connectors.length}) <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {connectors.length === 0 ? (
              <EmptyState
                icon={Link2}
                title="No connectors configured"
                description="Configure live Google Sheets or ERP connectors to start syncing official academic data."
                action={
                  <Button size="sm" asChild>
                    <Link href={"/admin/connectors" as any}>Configure Connector</Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {connectors.slice(0, 4).map((conn) => (
                  <div
                    key={conn.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 p-3.5 transition-all hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <Link2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{conn.name}</p>
                          <Badge variant="outline" className="text-[10px] uppercase font-mono">
                            {conn.connectorType}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Sync frequency: <span className="font-medium text-foreground capitalize">{conn.syncFrequency}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "px-2.5 py-0.5 text-[10px] font-semibold",
                          conn.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {conn.isActive ? "Connected" : "Disabled"}
                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerManualSync(conn.id, conn.institutionId)}
                        className="h-8 gap-1 text-xs"
                      >
                        <RefreshCw className="h-3 w-3" /> Sync Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Quick Actions & Recoveries */}
        <Card className="glass-shelf">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quick Console Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href={"/admin/connectors" as any}
              className="flex items-center justify-between rounded-xl border border-border/60 p-3.5 text-xs font-semibold transition-all hover:border-indigo-500/40 hover:bg-indigo-500/5"
            >
              <div className="flex items-center gap-2.5">
                <Link2 className="h-4 w-4 text-indigo-500" />
                <span>Configure Live Google Sheet</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              href={"/admin/retry-queue" as any}
              className="flex items-center justify-between rounded-xl border border-border/60 p-3.5 text-xs font-semibold transition-all hover:border-purple-500/40 hover:bg-purple-500/5"
            >
              <div className="flex items-center gap-2.5">
                <RotateCcw className="h-4 w-4 text-purple-500" />
                <span>Inspect Retry Queue ({pendingRetries})</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              href={"/admin/emergency-import" as any}
              className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/5 p-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-all hover:bg-rose-500/10"
            >
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="h-4 w-4 text-rose-500" />
                <span>Emergency Import Recovery</span>
              </div>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              href={"/admin/audit-logs" as any}
              className="flex items-center justify-between rounded-xl border border-border/60 p-3.5 text-xs font-semibold transition-all hover:bg-muted/50"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>View Security Audit Logs</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Synchronization Activity Log */}
      <Card className="glass-shelf">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Sync Executions</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs" asChild>
            <Link href={"/admin/sync-activity" as any}>View full log</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentJobs.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">No sync execution history recorded yet.</p>
          ) : (
            <div className="divide-y divide-border/50">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex flex-wrap items-center justify-between py-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-2.5 w-2.5 rounded-full",
                      job.status === "completed" ? "bg-emerald-500" : job.status === "failed" ? "bg-rose-500" : "bg-amber-500"
                    )} />
                    <div>
                      <p className="font-semibold text-foreground font-mono">{job.id.substring(0, 8)}...</p>
                      <p className="text-[11px] text-muted-foreground">Trigger: {job.triggeredBy}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-[11px]">
                    <span>Read: {job.processedRows}</span>
                    <span className="text-emerald-500">Inserted: {job.insertedRows}</span>
                    <span className="text-amber-500">Quarantined: {job.quarantinedRows}</span>
                    <Badge variant={job.status === "completed" ? "secondary" : "destructive"} className="text-[9px] uppercase">
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
