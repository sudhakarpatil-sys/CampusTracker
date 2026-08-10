"use client";

import * as React from "react";
import { RotateCcw, AlertTriangle, CheckCircle2, Clock, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useSyncHistory } from "@/hooks/use-sync-history";
import { cn, formatDate } from "@/lib/utils";

export function RetryQueueViewerContent() {
  const { retryItems, isLoading, executeRetry, refetchRetries } = useSyncHistory();
  const [retryingId, setRetryingId] = React.useState<string | null>(null);

  async function handleRetryNow(id: string) {
    setRetryingId(id);
    await executeRetry(id);
    setRetryingId(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Sync Retry Management Queue
          </h1>
          <p className="text-sm text-muted-foreground">
            Inspect failed synchronization jobs, attempt histories, and trigger manual retry executions.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetchRetries()} className="h-8 gap-1.5 text-xs">
          <RotateCcw className="h-3.5 w-3.5" /> Refresh Queue
        </Button>
      </div>

      {/* Queue Table */}
      <Card className="glass-shelf overflow-hidden">
        <CardContent className="p-0">
          {retryItems.length === 0 ? (
            <EmptyState
              icon={RotateCcw}
              title="Retry queue is empty"
              description="No failed synchronization jobs currently queued for retry."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 bg-muted/40 font-mono uppercase text-[10px] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Queue ID</th>
                    <th className="px-4 py-3">Attempts</th>
                    <th className="px-4 py-3">Error Reason</th>
                    <th className="px-4 py-3">Next Scheduled Retry</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {retryItems.map((item) => {
                    const isRetrying = retryingId === item.id;
                    return (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-foreground">
                          #{item.id.substring(0, 8)}
                        </td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">
                          {item.attemptCount} / 5 attempts
                        </td>
                        <td className="px-4 py-3 text-rose-500 max-w-xs truncate">
                          {item.errorReason || "Network timeout / source unavailable"}
                        </td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">
                          {formatDate(item.nextRetryAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={item.status === "resolved" ? "secondary" : item.status === "processing" ? "outline" : "destructive"}
                            className="text-[9px] uppercase font-mono px-2 py-0.5"
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            size="sm"
                            disabled={isRetrying || item.status === "resolved"}
                            onClick={() => handleRetryNow(item.id)}
                            className="h-7 text-xs bg-indigo-600 text-white hover:bg-indigo-700 gap-1 px-2.5"
                          >
                            <Play className={`h-3 w-3 ${isRetrying ? "animate-spin" : ""}`} />
                            {isRetrying ? "Executing..." : "Retry Now"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
