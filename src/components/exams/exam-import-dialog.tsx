"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Upload, Loader2, Calendar, MapPin, Check, Plus, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExams } from "@/hooks/use-exams";
import { useSubjects } from "@/hooks/use-subjects";
import { toast } from "@/hooks/use-toast";

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

export function ExamImportDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [pastedText, setPastedText] = React.useState("");
  const [detectedExams, setDetectedExams] = React.useState<DetectedExam[]>([]);
  const [step, setStep] = React.useState<"upload" | "review">("upload");

  const { createExam } = useExams();
  const { subjects } = useSubjects();

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

  async function handleExtract() {
    if (!file && !pastedText.trim()) {
      toast({ title: "Please upload an exam schedule file or paste text." });
      return;
    }

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
      if (!res.ok) throw new Error(data.error || "Failed to process document");

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
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    const toImport = detectedExams.filter((e) => e.included);
    if (toImport.length === 0) {
      toast({ title: "No exams selected to import." });
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
      toast({ title: `Successfully imported ${count} exam(s)!` });
      setOpen(false);
      setStep("upload");
      setFile(null);
      setPastedText("");
      setDetectedExams([]);
    } catch (err) {
      toast({ title: "Import failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md">
            <Sparkles className="mr-1.5 h-4 w-4 text-amber-300" /> Import Exam Schedule with AI
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-4 w-4" />
              </span>
              AI Exam Schedule Import
            </DialogTitle>
            <Button variant="ghost" size="sm" className="text-xs text-indigo-600 dark:text-indigo-400" asChild onClick={() => setOpen(false)}>
              <Link href="/exams/import">Open Full Wizard ↗</Link>
            </Button>
          </div>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-5 pt-2">
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-indigo-500 mb-2" />
              <p className="text-sm font-semibold text-foreground">Upload Exam Date Sheet / Timetable</p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your exam schedule PDF, PNG, or JPG document
              </p>

              <Input
                type="file"
                accept=".pdf,image/png,image/jpeg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mx-auto mt-4 max-w-xs cursor-pointer text-xs"
              />

              {file && (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400">
                  <Check className="h-3.5 w-3.5" /> Selected: {file.name}
                </div>
              )}
            </div>

            <div className="relative flex items-center justify-center">
              <span className="bg-card px-3 font-mono text-[10px] text-muted-foreground uppercase">Or paste raw text</span>
              <div className="absolute inset-0 -z-10 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Exam Dates & Schedule Text</Label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="e.g. 15-Nov-2026 10:00 AM - Data Structures - Hall 301..."
                className="w-full h-24 rounded-lg border border-input bg-background p-3 text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={loading || (!file && !pastedText.trim())}
                onClick={handleExtract}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
              >
                {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4 text-amber-300" />}
                Extract Exam Schedule
              </Button>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                AI detected <strong className="text-foreground">{detectedExams.length}</strong> exam(s). Review and confirm below:
              </p>
              <Button variant="ghost" size="sm" onClick={() => setStep("upload")} className="text-xs">
                ← Back to Upload
              </Button>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {detectedExams.map((exam, idx) => (
                <div
                  key={exam.id}
                  className={`rounded-xl border p-3.5 transition-all ${
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
                        <Label className="text-[11px] text-muted-foreground">Exam Name / Subject</Label>
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
                            <SelectItem value="none">General / No Subject</SelectItem>
                            {subjects.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Date (YYYY-MM-DD)</Label>
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

            <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={saving || detectedExams.filter((e) => e.included).length === 0}
                onClick={handleImport}
                className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white shadow-md"
              >
                {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                Import {detectedExams.filter((e) => e.included).length} Exam(s)
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
