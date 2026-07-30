"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { WelcomeStep } from "@/components/timetable-import/steps/welcome-step";
import { UploadStep } from "@/components/timetable-import/steps/upload-step";
import { ProcessingStep } from "@/components/timetable-import/steps/processing-step";
import { ReviewStep } from "@/components/timetable-import/steps/review-step";
import { SuccessStep } from "@/components/timetable-import/steps/success-step";
import { DuplicateDecisionDialog } from "@/components/timetable-import/duplicate-decision-dialog";
import { useTimetableImport } from "@/hooks/use-timetable-import";
import type { DetectedSubjectWithMatch } from "@/lib/validations/timetable-import";
import type { DuplicateCandidate } from "@/lib/timetable-import/duplicate-detection";
import type { TimetableImport } from "@/types/database.types";

type WizardStep = "welcome" | "upload" | "processing" | "review" | "success";
const STEP_ORDER: WizardStep[] = ["welcome", "upload", "processing", "review", "success"];

export function ImportWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState<WizardStep>("welcome");
  const [activeFileName, setActiveFileName] = React.useState<string | null>(null);
  const [activeImportId, setActiveImportId] = React.useState<string | null>(null);
  const [subjects, setSubjects] = React.useState<DetectedSubjectWithMatch[] | null>(null);
  const [slotCount, setSlotCount] = React.useState(0);
  const [itemCount, setItemCount] = React.useState(0);
  const [conflictCount, setConflictCount] = React.useState(0);
  const [stepError, setStepError] = React.useState<string | null>(null);
  const [subjectsCreated, setSubjectsCreated] = React.useState(0);
  const [slotsCreated, setSlotsCreated] = React.useState(0);

  const [pendingFile, setPendingFile] = React.useState<File | null>(null);
  const [pendingChecksum, setPendingChecksum] = React.useState<string | null>(null);
  const [duplicate, setDuplicate] = React.useState<DuplicateCandidate | null>(null);
  const [duplicateStage, setDuplicateStage] = React.useState<"upload" | "content" | null>(null);

  const {
    imports,
    precheckUpload,
    uploadTimetable,
    processImport,
    structureImport,
    setDuplicateResolution,
    generateTimetableItems,
    importTimetable,
    retryImport,
    cancelImport,
    isUploading,
    isProcessing,
    isStructuring,
    isGenerating,
    isImporting,
    uploadProgress,
  } = useTimetableImport();

  const activeImportRow: TimetableImport | undefined = imports.find((i) => i.id === activeImportId);
  const stepIndex = STEP_ORDER.indexOf(step);
  const progressValue = ((stepIndex + 1) / STEP_ORDER.length) * 100;

  function resetToUpload() {
    setActiveFileName(null);
    setActiveImportId(null);
    setSubjects(null);
    setSlotCount(0);
    setItemCount(0);
    setConflictCount(0);
    setStepError(null);
    setStep("upload");
  }

  async function runImportPipeline(
    file: File,
    checksum: string,
    options: { resolution: "replace" | "merge" | "new"; replacesImportId?: string }
  ) {
    const uploadResult = await uploadTimetable(file, checksum, options);
    if (uploadResult.error || !uploadResult.importId) return;

    setActiveFileName(file.name);
    setActiveImportId(uploadResult.importId);
    setStep("processing");

    const extraction = await processImport(uploadResult.importId);
    if (extraction.error) {
      setStepError(extraction.error);
      return;
    }

    const structured = await structureImport(uploadResult.importId);
    if (structured.error) {
      setStepError(structured.error);
      return;
    }
    setSubjects(structured.subjects);
    setSlotCount(structured.slotCount);

    // Second duplicate checkpoint — only relevant if the first (checksum)
    // check didn't already resolve it, and only fires once branch/semester
    // are actually known.
    if (structured.duplicate && options.resolution === "new") {
      setDuplicate(structured.duplicate);
      setDuplicateStage("content");
      return; // generation resumes once the dialog is answered
    }

    const generated = await generateTimetableItems(uploadResult.importId);
    setStepError(generated.error);
    setItemCount(generated.itemCount);
    setConflictCount(generated.conflictCount);
  }

  async function handleFileConfirmed(file: File) {
    const pre = await precheckUpload(file);
    if (pre.error || !pre.checksum) return;

    if (pre.duplicate) {
      setPendingFile(file);
      setPendingChecksum(pre.checksum);
      setDuplicate(pre.duplicate);
      setDuplicateStage("upload");
      return;
    }

    await runImportPipeline(file, pre.checksum, { resolution: "new" });
  }

  async function handleDuplicateDecision(resolution: "replace" | "merge" | "new") {
    if (!duplicate) return;

    if (duplicateStage === "upload" && pendingFile && pendingChecksum) {
      const file = pendingFile;
      const checksum = pendingChecksum;
      const dup = duplicate;
      setDuplicate(null);
      setDuplicateStage(null);
      setPendingFile(null);
      setPendingChecksum(null);
      await runImportPipeline(file, checksum, { resolution, replacesImportId: dup.id ?? undefined });
      return;
    }

    if (duplicateStage === "content" && activeImportId) {
      await setDuplicateResolution(activeImportId, resolution, resolution === "replace" ? (duplicate.id ?? undefined) : undefined);
      setDuplicate(null);
      setDuplicateStage(null);
      const generated = await generateTimetableItems(activeImportId);
      setStepError(generated.error);
      setItemCount(generated.itemCount);
      setConflictCount(generated.conflictCount);
    }
  }

  function handleDuplicateCancel() {
    const stage = duplicateStage;
    const importId = activeImportId;
    setDuplicate(null);
    setDuplicateStage(null);
    setPendingFile(null);
    setPendingChecksum(null);
    if (stage === "content" && importId) cancelImport(importId);
    resetToUpload();
  }

  async function handleRetry() {
    if (!activeImportId) return;
    setStepError(null);
    setSubjects(null);

    const extraction = await retryImport(activeImportId);
    if (extraction.error) {
      setStepError(extraction.error);
      return;
    }

    const structured = await structureImport(activeImportId);
    if (structured.error) {
      setStepError(structured.error);
      return;
    }
    setSubjects(structured.subjects);
    setSlotCount(structured.slotCount);

    const generated = await generateTimetableItems(activeImportId);
    setStepError(generated.error);
    setItemCount(generated.itemCount);
    setConflictCount(generated.conflictCount);
  }

  async function handleConfirmImport() {
    if (!activeImportId) return;
    const result = await importTimetable(activeImportId);
    if (result.error) return; // toast already shown; stay on review to retry
    setSubjectsCreated(result.subjectsCreated);
    setSlotsCreated(result.slotsCreated);
    setStep("success");
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Step {stepIndex + 1} of {STEP_ORDER.length}
          </span>
          <span className="capitalize">{step}</span>
        </div>
        <Progress value={progressValue} />
      </div>

      {step === "welcome" && <WelcomeStep onContinue={() => setStep("upload")} />}

      {step === "upload" && (
        <UploadStep
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          onBack={() => setStep("welcome")}
          onFileConfirmed={handleFileConfirmed}
        />
      )}

      {step === "processing" && activeFileName && (
        <ProcessingStep
          fileName={activeFileName}
          isBusy={isProcessing || isStructuring || isGenerating}
          busyLabel={
            isProcessing ? "Reading document…" : isStructuring ? "Understanding your timetable…" : "Building your timetable…"
          }
          subjects={subjects}
          slotCount={slotCount}
          itemCount={itemCount}
          conflictCount={conflictCount}
          error={stepError}
          onUploadAnother={resetToUpload}
          onBackToTimetable={() => router.push("/timetable")}
          onReview={() => setStep("review")}
          onRetry={handleRetry}
        />
      )}

      {step === "review" && activeImportRow && (
        <ReviewStep
          importRow={activeImportRow}
          isImporting={isImporting}
          onBack={resetToUpload}
          onConfirm={handleConfirmImport}
        />
      )}

      {step === "success" && <SuccessStep subjectsCreated={subjectsCreated} slotsCreated={slotsCreated} />}

      <DuplicateDecisionDialog
        open={duplicate !== null}
        duplicate={duplicate}
        onReplace={() => handleDuplicateDecision("replace")}
        onMerge={() => handleDuplicateDecision("merge")}
        onCancel={handleDuplicateCancel}
      />
    </div>
  );
}
