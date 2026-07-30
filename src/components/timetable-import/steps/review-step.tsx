"use client";

import * as React from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTimetableImportItems } from "@/hooks/use-timetable-import-items";
import { useSubjects } from "@/hooks/use-subjects";
import { safeTimeToMinutes } from "@/lib/timetable-import/timetable-generation";
import { TimetablePreviewGrid } from "@/components/timetable-import/timetable-preview-grid";
import type { TimetableImport, TimetableImportItem } from "@/types/database.types";

const DAY_LABELS: Record<number, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};
const CONFIDENCE_VARIANT: Record<string, "success" | "accent" | "destructive"> = {
  high: "success",
  medium: "accent",
  low: "destructive",
};
const NEW_SUBJECT_VALUE = "__new__";

/** conflict_reason is a snapshot computed once during AI structuring — it
 * doesn't update when the user edits start/end time in this screen, so a
 * bad edit (end before start) would otherwise sail through to the DB and
 * hit the timetable_slots_time_order check constraint. Re-check live. */
function hasInvalidTimeRange(item: TimetableImportItem): boolean {
  const start = safeTimeToMinutes(item.start_time ?? "");
  const end = safeTimeToMinutes(item.end_time ?? "");
  return start === null || end === null || end <= start;
}

interface ReviewStepProps {
  importRow: TimetableImport;
  isImporting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export function ReviewStep({ importRow, isImporting, onBack, onConfirm }: ReviewStepProps) {
  const { items, isLoading, updateItem } = useTimetableImportItems(importRow.id);
  const { subjects: existingSubjects } = useSubjects();

  const grouped = React.useMemo(() => {
    const map = new Map<number, TimetableImportItem[]>();
    for (const item of items) {
      const day = item.day_of_week ?? 0;
      map.set(day, [...(map.get(day) ?? []), item]);
    }
    return map;
  }, [items]);

  const conflictCount = items.filter((i) => i.conflict_reason).length;
  const includedCount = items.filter((i) => i.is_included).length;
  const includedInvalidCount = items.filter((i) => i.is_included && hasInvalidTimeRange(i)).length;

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Review your timetable</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {includedCount} of {items.length} lectures will be imported. Edit anything before confirming.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {importRow.detected_branch && <Badge variant="accent">{importRow.detected_branch}</Badge>}
          {importRow.detected_semester && <Badge variant="accent">Sem {importRow.detected_semester}</Badge>}
          {importRow.detected_division && <Badge variant="accent">Div {importRow.detected_division}</Badge>}
        </div>
      </div>

      {conflictCount > 0 && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-xs text-muted-foreground">
            {conflictCount} lecture{conflictCount === 1 ? "" : "s"} need attention — overlapping times or unclear
            day/time. They&apos;re excluded by default; fix and re-check the box to include them.
          </p>
        </div>
      )}

      {includedInvalidCount > 0 && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-xs text-muted-foreground">
            {includedInvalidCount} included lecture{includedInvalidCount === 1 ? " has" : "s have"} an end time at or
            before its start time — fix the time or uncheck it before importing.
          </p>
        </div>
      )}

      <Tabs defaultValue="list" className="mt-6">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="preview">Weekly preview</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4 space-y-5">
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!isLoading &&
            Array.from(grouped.entries()).map(([day, dayItems]) => (
              <div key={day}>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {day === 0 ? "Needs a day set" : DAY_LABELS[day]}
                </p>
                <div className="space-y-2">
                  {dayItems.map((item) => {
                    const timeInvalid = hasInvalidTimeRange(item);
                    return (
                    <div
                      key={item.id}
                      className={
                        "margin-tab grid grid-cols-1 items-center gap-3 rounded-lg border border-border bg-surface-raised p-3 sm:grid-cols-[auto_1.4fr_1fr_1fr_1fr_auto]" +
                        (item.conflict_reason || (item.is_included && timeInvalid) ? " border-destructive/40" : "")
                      }
                    >
                      <Checkbox
                        checked={item.is_included}
                        onCheckedChange={(checked) => updateItem(item.id, { is_included: Boolean(checked) })}
                        aria-label="Include this lecture"
                      />

                      <Select
                        value={item.matched_subject_id ?? NEW_SUBJECT_VALUE}
                        onValueChange={(value) =>
                          updateItem(item.id, { matched_subject_id: value === NEW_SUBJECT_VALUE ? null : value })
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder={item.subject_name_raw} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NEW_SUBJECT_VALUE}>Create new: {item.subject_name_raw}</SelectItem>
                          {existingSubjects.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="time"
                        value={item.start_time ?? ""}
                        onChange={(e) => updateItem(item.id, { start_time: e.target.value })}
                        className="h-9 font-mono text-xs"
                      />
                      <Input
                        type="time"
                        value={item.end_time ?? ""}
                        onChange={(e) => updateItem(item.id, { end_time: e.target.value })}
                        className="h-9 font-mono text-xs"
                      />
                      <Input
                        placeholder="Room"
                        value={item.classroom ?? ""}
                        onChange={(e) => updateItem(item.id, { classroom: e.target.value })}
                        className="h-9 text-xs"
                      />

                      <div className="flex items-center gap-2 sm:justify-end">
                        <Badge variant={CONFIDENCE_VARIANT[item.confidence]}>{item.confidence}</Badge>
                      </div>

                      {item.conflict_reason && (
                        <p className="col-span-full text-xs text-destructive">{item.conflict_reason}</p>
                      )}
                      {!item.conflict_reason && item.is_included && timeInvalid && (
                        <p className="col-span-full text-xs text-destructive">
                          End time must be after the start time.
                        </p>
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <TimetablePreviewGrid items={items} />
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} disabled={isImporting}>
          <ArrowLeft className="h-4 w-4" /> Start over
        </Button>
        <Button onClick={onConfirm} disabled={isImporting || includedCount === 0 || includedInvalidCount > 0}>
          {isImporting ? "Importing…" : `Confirm & import (${includedCount})`}
        </Button>
      </div>
    </Card>
  );
}
