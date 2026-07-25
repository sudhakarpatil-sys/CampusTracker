"use client";

import { AlertTriangle, CheckCircle2, Loader2, PlusCircle, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DetectedSubjectWithMatch } from "@/lib/validations/timetable-import";

interface ProcessingStepProps {
  fileName: string;
  isBusy: boolean;
  busyLabel: string;
  subjects: DetectedSubjectWithMatch[] | null;
  slotCount: number;
  itemCount: number;
  conflictCount: number;
  error: string | null;
  onUploadAnother: () => void;
  onBackToTimetable: () => void;
  onReview: () => void;
  onRetry: () => void;
}

const CONFIDENCE_VARIANT: Record<string, "success" | "accent" | "destructive"> = {
  high: "success",
  medium: "accent",
  low: "destructive",
};

export function ProcessingStep({
  fileName,
  isBusy,
  busyLabel,
  subjects,
  itemCount,
  conflictCount,
  error,
  onUploadAnother,
  onBackToTimetable,
  onReview,
  onRetry,
}: ProcessingStepProps) {
  return (
    <Card className="p-6 sm:p-8">
      {isBusy && (
        <div className="py-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <h2 className="mt-5 font-display text-xl font-semibold">{busyLabel}</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{fileName}</span>
          </p>
        </div>
      )}

      {!isBusy && error && (
        <div className="py-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="mt-5 font-display text-xl font-semibold">Couldn&apos;t process that file</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-6" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}

      {!isBusy && !error && subjects && (
        <>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-xl font-semibold">Here&apos;s what we found</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {subjects.length} subject{subjects.length === 1 ? "" : "s"} and {itemCount} lecture
              {itemCount === 1 ? "" : "s"} are ready to review.
            </p>
          </div>

          {conflictCount > 0 && (
            <div className="mx-auto mt-4 flex max-w-md items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-left">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p className="text-xs text-muted-foreground">
                {conflictCount} lecture{conflictCount === 1 ? "" : "s"} overlap another detected lecture or have an
                unclear time, and are excluded for now — you can resolve these on the review screen.
              </p>
            </div>
          )}

          <div className="mx-auto mt-6 max-w-md space-y-2">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="margin-tab flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-raised px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{subject.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    {subject.matched_subject_id ? (
                      <>
                        <RefreshCcw className="h-3 w-3" /> Matches an existing subject
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-3 w-3" /> Will be created as new
                      </>
                    )}
                  </p>
                </div>
                <Badge variant={CONFIDENCE_VARIANT[subject.confidence]}>{subject.confidence}</Badge>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
        <Button variant="outline" onClick={onUploadAnother} disabled={isBusy}>
          Upload another file
        </Button>
        {!isBusy && !error && subjects ? (
          <Button onClick={onReview}>Review & edit</Button>
        ) : (
          <Button onClick={onBackToTimetable} disabled={isBusy}>
            Back to timetable
          </Button>
        )}
      </div>
    </Card>
  );
}
