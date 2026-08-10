"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { SyncJob } from "@/types/sync";
import { formatDate, cn } from "@/lib/utils";

interface SyncDetailsDialogProps {
  job: SyncJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SyncDetailsDialog({ job, open, onOpenChange }: SyncDetailsDialogProps) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="font-display text-lg font-bold">
              Sync Job #{job.id.substring(0, 8)}
            </DialogTitle>
            <Badge
              variant={job.status === "completed" ? "secondary" : job.status === "failed" ? "destructive" : "outline"}
              className="text-[10px] uppercase font-mono"
            >
              {job.status}
            </Badge>
          </div>
          <DialogDescription className="text-xs font-mono">
            Triggered by: {job.triggeredBy} · Started {formatDate(job.startedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Row Metrics Grid */}
          <div className="grid grid-cols-4 gap-2 rounded-xl border border-border/60 bg-muted/20 p-3 text-center">
            <div>
              <p className="text-[10px] uppercase font-mono text-muted-foreground">Processed</p>
              <p className="font-mono text-base font-bold text-foreground">{job.processedRows}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono text-muted-foreground">Inserted</p>
              <p className="font-mono text-base font-bold text-emerald-500">{job.insertedRows}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono text-muted-foreground">Updated</p>
              <p className="font-mono text-base font-bold text-indigo-500">{job.updatedRows}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono text-muted-foreground">Quarantined</p>
              <p className="font-mono text-base font-bold text-amber-500">{job.quarantinedRows}</p>
            </div>
          </div>

          {/* Execution details */}
          <div className="space-y-1.5 rounded-xl border border-border/60 p-3 text-muted-foreground">
            <div className="flex justify-between">
              <span>Execution Duration:</span>
              <span className="font-mono font-medium text-foreground">{job.executionTimeMs || 0} ms</span>
            </div>
            <div className="flex justify-between">
              <span>Completed Timestamp:</span>
              <span className="font-mono font-medium text-foreground">{job.completedAt ? formatDate(job.completedAt) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Institution ID:</span>
              <span className="font-mono text-[11px] text-foreground">{job.institutionId}</span>
            </div>
          </div>

          {/* Error log if present */}
          {job.errorLog && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-rose-500 font-semibold">Error Traceback</span>
              <div className="max-h-36 overflow-y-auto rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 font-mono text-[11px] text-rose-600 dark:text-rose-400">
                {job.errorLog}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
