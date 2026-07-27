"use client";

import * as React from "react";
import { ArrowLeft, FileText, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { timetableUploadSchema, MAX_TIMETABLE_FILE_SIZE_BYTES } from "@/lib/validations/timetable-import";
import { cn } from "@/lib/utils";

const ACCEPT_ATTR = ".pdf,.png,.jpg,.jpeg";

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type UploadProgress = "idle" | "checking" | "uploading" | "saving" | "done";

const PROGRESS_LABEL: Record<UploadProgress, string> = {
  idle: "",
  checking: "Checking file…",
  uploading: "Uploading…",
  saving: "Saving…",
  done: "Done",
};

interface UploadStepProps {
  isUploading: boolean;
  uploadProgress: UploadProgress;
  onBack: () => void;
  onFileConfirmed: (file: File) => void;
}

export function UploadStep({ isUploading, uploadProgress, onBack, onFileConfirmed }: UploadStepProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  function validateAndSet(file: File) {
    const parsed = timetableUploadSchema.safeParse({ file });
    if (!parsed.success) {
      setValidationError(parsed.error.errors[0]?.message ?? "That file can't be used.");
      setSelectedFile(null);
      return;
    }
    setValidationError(null);
    setSelectedFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSet(file);
  }

  function handleBrowse(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
  }

  return (
    <Card className="p-8 sm:p-10">
      <h2 className="font-display text-xl font-semibold">Upload your timetable</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Upload just your own division&apos;s timetable — a PDF works best, a clear photo works too.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          isDragging ? "border-accent bg-accent/5" : "border-border"
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <UploadCloud className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">Drag and drop your file here</p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, PNG, or JPG — up to {Math.round(MAX_TIMETABLE_FILE_SIZE_BYTES / (1024 * 1024))}MB
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Browse files
        </Button>
        <input ref={inputRef} type="file" accept={ACCEPT_ATTR} className="hidden" onChange={handleBrowse} />
      </div>

      {validationError && <p className="mt-3 text-xs text-destructive">{validationError}</p>}

      {selectedFile && !validationError && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-raised px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <FileText className="h-4 w-4 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          {!isUploading && (
            <button onClick={() => setSelectedFile(null)} aria-label="Remove file">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onBack} disabled={isUploading}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          type="button"
          disabled={!selectedFile || isUploading}
          onClick={() => selectedFile && onFileConfirmed(selectedFile)}
        >
          {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isUploading ? PROGRESS_LABEL[uploadProgress] : "Continue"}
        </Button>
      </div>
    </Card>
  );
}
