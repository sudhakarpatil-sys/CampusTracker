"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Upload, Check, Loader2, Calendar, MapPin, ArrowRight, ArrowLeft, GraduationCap, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExams } from "@/hooks/use-exams";
import { useSubjects } from "@/hooks/use-subjects";
import { toast } from "@/hooks/use-toast";

type WizardStep = "welcome" | "upload" | "processing" | "review" | "success";
const STEP_ORDER: WizardStep[] = ["welcome", "upload", "processing", "review", "success"];

interface DetectedExam {
  id: string;
  subject_name: string;
  matched_subject_id: string | null;
  exam_date: string;
  exam_time: string;
  venue: string;
  syllabus: string;
  included: boolean;
}

export function ExamImportWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState<WizardStep>("welcome");
  const [file, setFile] = React.useState<File | null>(null);
  const [pastedText, setPastedText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [detectedExams, setDetectedExams] = React.useState<DetectedExam[]>([]);
  const [importedCount, setImportedCount] = React.useState(0);

  const { createExam } = useExams();
  const { subjects } = useSubjects();

  const stepIndex = STEP_ORDER.indexOf(step);
  const progressValue = ((stepIndex + 1) / STEP_ORDER.length) * 100;

  function matchSubject(name: string): string | null {
    const lower = name.toLowerCase().trim();
    const found = subjects.find(
      (s) =>
        s.name.toLowerCase() === lower ||
        (s.code && s.code.toLowerCase() === lower) ||
        lower.includes(s.name.toLowerCase())
    );
    return found ? found.id : null;
  }

  async function handleStartExtraction() {
    if (!file && !pastedText.trim()) {
      toast({ title: "Please select an exam schedule file or paste text." });
      return;
    }

    setStep("processing");
    setLoading(true);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (pastedText) formData.append("text", pastedText);

      const res = await fetch("/api/ai/extract-exams", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to extract exam schedule");

      const items: DetectedExam[] = (data.exams || []).map((e: any, idx: number) => ({
        id: `exam-${idx}-${Date.now()}`,
        subject_name: e.subject_name || "General Exam",
        matched_subject_id: matchSubject(e.subject_name || ""),
        exam_date: e.exam_date || new Date().toISOString().split("T")[0],
        exam_time: e.exam_time || "10:00",
        venue: e.venue || "",
        syllabus: e.syllabus || "",
        included: true,
      }));

      setDetectedExams(items);
      setStep("review");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI extraction failed";
      toast({ title: "Extraction failed", description: msg });
      setStep("upload");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmImport() {
    const toImport = detectedExams.filter((e) => e.included);
    if (toImport.length === 0) {
      toast({ title: "No exams selected." });
      return;
    }

    setSaving(true);
    try {
      let count = 0;
      for (const exam of toImport) {
        await createExam({
          subjectId: exam.matched_subject_id || undefined,
          examDate: exam.exam_date,
          examTime: exam.exam_time || undefined,
          venue: exam.venue || undefined,
          syllabus: exam.syllabus || undefined,
          preparationStatus: "not_started",
        });
        count++;
      }
      setImportedCount(count);
      setStep("success");
    } catch (err) {
      toast({ title: "Import failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Step Progress Bar */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Step {stepIndex + 1} of {STEP_ORDER.length}
          </span>
          <span className="capitalize font-semibold text-foreground">{step}</span>
        </div>
        <Progress value={progressValue} className="h-1.5" />
      </div>

      {/* STEP 1: WELCOME */}
      {step === "welcome" && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>AI Exam Import Wizard</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Import Exam Schedule & Date Sheet
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload your midterm, final exam, or quiz date sheet (PDF or image). Gemini AI will extract exam dates, times, halls, and match them with your enrolled courses automatically.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2 text-xs">
            <p className="font-semibold text-foreground">💡 Tips for accurate AI extraction:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>PDFs, clear photos, or screenshots of institute date sheets work best.</li>
              <li>You can review and edit every date, venue, and time before saving.</li>
              <li>Imported exams sync directly to your countdown timers and calendar.</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => router.push("/exams")}>
              Back to Exams
            </Button>
            <Button onClick={() => setStep("upload")} className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md">
              Start Upload <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: UPLOAD */}
      {step === "upload" && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="font-display text-xl font-bold text-foreground">Upload Exam Date Sheet</h3>
            <p className="text-xs text-muted-foreground">Select a PDF or image file containing your exam dates.</p>
          </div>

          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center space-y-3">
            <Upload className="mx-auto h-10 w-10 text-indigo-500" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Choose Date Sheet File</p>
              <p className="text-xs text-muted-foreground">Supports PDF, PNG, JPG (up to 10MB)</p>
            </div>

            <Input
              type="file"
              accept=".pdf,image/png,image/jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mx-auto max-w-xs cursor-pointer text-xs"
            />

            {file && (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5" /> {file.name}
              </div>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            <span className="bg-card px-3 font-mono text-[10px] text-muted-foreground uppercase">Or paste date sheet text</span>
            <div className="absolute inset-0 -z-10 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
          </div>

          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste date sheet text here (e.g. 15-Nov-2026 - Data Structures - Hall 302)..."
            className="w-full h-24 rounded-lg border border-input bg-background p-3 text-xs focus:ring-1 focus:ring-indigo-500"
          />

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => setStep("welcome")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <Button
              disabled={!file && !pastedText.trim()}
              onClick={handleStartExtraction}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
            >
              <Sparkles className="mr-1.5 h-4 w-4 text-amber-300" /> Extract Schedule with AI
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: PROCESSING */}
      {step === "processing" && (
        <Card className="p-10 text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-xl font-bold text-foreground">Extracting Exam Schedule...</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Google Gemini AI is reading your document, identifying subjects, parsing exam dates, and matching venues.
            </p>
          </div>
        </Card>
      )}

      {/* STEP 4: REVIEW */}
      {step === "review" && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">Review Detected Exams</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                AI detected <strong className="text-foreground">{detectedExams.length}</strong> exam(s). Edit dates, select subjects, or uncheck items.
              </p>
            </div>

            <Badge variant="outline" className="font-mono text-xs">
              {detectedExams.filter((e) => e.included).length} Selected
            </Badge>
          </div>

          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {detectedExams.map((exam, idx) => (
              <div
                key={exam.id}
                className={`rounded-xl border p-4 transition-all ${
                  exam.included ? "border-indigo-500/40 bg-indigo-500/5" : "border-border/50 bg-muted/20 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={exam.included}
                    onCheckedChange={(checked) => {
                      setDetectedExams((prev) =>
                        prev.map((e, i) => (i === idx ? { ...e, included: !!checked } : e))
                      );
                    }}
                    className="mt-1"
                  />

                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Exam Title / Subject</Label>
                      <Input
                        value={exam.subject_name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDetectedExams((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, subject_name: val } : item))
                          );
                        }}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Match Subject</Label>
                      <Select
                        value={exam.matched_subject_id || "none"}
                        onValueChange={(val) => {
                          setDetectedExams((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, matched_subject_id: val === "none" ? null : val } : item))
                          );
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">General Exam / No Subject</SelectItem>
                          {subjects.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Exam Date</Label>
                      <Input
                        type="date"
                        value={exam.exam_date}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDetectedExams((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, exam_date: val } : item))
                          );
                        }}
                        className="h-8 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Venue / Hall</Label>
                      <Input
                        placeholder="e.g. Hall 302"
                        value={exam.venue}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDetectedExams((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, venue: val } : item))
                          );
                        }}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-border/50">
            <Button variant="outline" onClick={() => setStep("upload")}>
              ← Re-upload
            </Button>

            <Button
              disabled={saving || detectedExams.filter((e) => e.included).length === 0}
              onClick={handleConfirmImport}
              className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white shadow-md"
            >
              {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Confirm & Import {detectedExams.filter((e) => e.included).length} Exam(s)
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: SUCCESS */}
      {step === "success" && (
        <Card className="p-10 text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-2xl font-bold text-foreground">Import Complete! 🎉</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Successfully imported <strong>{importedCount}</strong> exam(s) into your countdown timers and master calendar.
            </p>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Button onClick={() => router.push("/exams")} className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md">
              View Exam Countdowns <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
