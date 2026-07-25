"use client";

import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DuplicateCandidate } from "@/lib/timetable-import/duplicate-detection";

interface DuplicateDecisionDialogProps {
  open: boolean;
  duplicate: DuplicateCandidate | null;
  onReplace: () => void;
  onMerge: () => void;
  onCancel: () => void;
}

export function DuplicateDecisionDialog({ open, duplicate, onReplace, onMerge, onCancel }: DuplicateDecisionDialogProps) {
  if (!duplicate) return null;

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <DialogTitle>This looks like something you&apos;ve imported before</DialogTitle>
          </div>
          <DialogDescription>
            &quot;{duplicate.original_filename}&quot; (version {duplicate.version_number}, uploaded{" "}
            {new Date(duplicate.created_at).toLocaleDateString()}) matches this upload. How should CampusTracker
            handle it?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Replace</span> — remove the previous import&apos;s lectures
            and use this one instead.
          </p>
          <p>
            <span className="font-medium text-foreground">Merge</span> — keep both; new lectures are added alongside
            what&apos;s already there.
          </p>
          <p>
            <span className="font-medium text-foreground">Cancel</span> — stop and keep things as they are.
          </p>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="outline" onClick={onMerge}>
            Merge
          </Button>
          <Button onClick={onReplace}>Replace</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
