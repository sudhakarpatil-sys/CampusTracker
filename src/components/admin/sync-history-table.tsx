"use client";

import * as React from "react";
import { Activity, Search, Filter, Eye, RefreshCw, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { SyncDetailsDialog } from "@/components/admin/sync-details-dialog";
import { useSyncHistory } from "@/hooks/use-sync-history";
import type { SyncJob } from "@/types/sync";
import { cn, formatDate } from "@/lib/utils";

export function SyncHistoryTableContent() {
  const { syncJobs, isLoading, refetchJobs } = useSyncHistory();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  const [selectedJob, setSelectedJob] = React.useState<SyncJob | null>(null);

  const filteredJobs = React.useMemo(() => {
    let result = [...syncJobs];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) => j.id.toLowerCase().includes(q) || j.triggeredBy.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((j) => j.status === statusFilter);
    }
    return result;
  }, [syncJobs, search, statusFilter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Sync Activity Log
          </h1>
          <p className="text-sm text-muted-foreground">
            Audit trail of automated polling jobs, execution durations, and row metrics.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetchJobs()} className="h-8 gap-1.5 text-xs">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Log
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by job ID or trigger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(null)}
            className="h-8 text-xs"
          >
            All ({syncJobs.length})
          </Button>
          {["completed", "failed", "processing", "pending"].map((st) => (
            <Button
              key={st}
              variant={statusFilter === st ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(st)}
              className="h-8 text-xs capitalize"
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <Card className="glass-shelf overflow-hidden">
        <CardContent className="p-0">
          {filteredJobs.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No sync history found"
              description={search ? "Try adjusting your search criteria." : "Sync execution records will appear here as connectors run."}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 bg-muted/40 font-mono uppercase text-[10px] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Job ID</th>
                    <th className="px-4 py-3">Triggered By</th>
                    <th className="px-4 py-3">Started At</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3 text-right">Processed</th>
                    <th className="px-4 py-3 text-right">Inserted</th>
                    <th className="px-4 py-3 text-right">Quarantined</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-foreground">
                        #{job.id.substring(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground capitalize font-medium">
                        {job.triggeredBy.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono">
                        {formatDate(job.startedAt)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono">
                        {job.executionTimeMs ? `${job.executionTimeMs}ms` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-foreground">
                        {job.processedRows}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-emerald-500">
                        +{job.insertedRows}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-amber-500">
                        {job.quarantinedRows}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={job.status === "completed" ? "secondary" : job.status === "failed" ? "destructive" : "outline"}
                          className="text-[9px] uppercase font-mono px-2 py-0.5"
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedJob(job)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Inspect Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drill-down Dialog */}
      <SyncDetailsDialog
        job={selectedJob}
        open={!!selectedJob}
        onOpenChange={(val) => { if (!val) setSelectedJob(null); }}
      />
    </div>
  );
}
