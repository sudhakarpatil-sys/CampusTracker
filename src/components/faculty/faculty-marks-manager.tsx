"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Save,
  Send,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Plus,
  BookOpen,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { useFaculty } from "@/hooks/use-faculty";

export interface StudentMarkEntry {
  id: string;
  rollNumber: string;
  studentName: string;
  marksObtained: number | string;
  maxMarks: number;
  status: "published" | "draft";
}

const INITIAL_MARKS: StudentMarkEntry[] = [
  { id: "m1", rollNumber: "CSE2026-001", studentName: "Aarav Sharma", marksObtained: 27, maxMarks: 30, status: "published" },
  { id: "m2", rollNumber: "CSE2026-002", studentName: "Aditi Patel", marksObtained: 24, maxMarks: 30, status: "published" },
  { id: "m3", rollNumber: "CSE2026-003", studentName: "Ananya Gupta", marksObtained: 29, maxMarks: 30, status: "published" },
  { id: "m4", rollNumber: "CSE2026-004", studentName: "Devansh Kumar", marksObtained: 18, maxMarks: 30, status: "draft" },
  { id: "m5", rollNumber: "CSE2026-005", studentName: "Ishita Verma", marksObtained: 26, maxMarks: 30, status: "published" },
  { id: "m6", rollNumber: "CSE2026-006", studentName: "Kabir Singh", marksObtained: 22, maxMarks: 30, status: "draft" },
];

export function FacultyMarksManagerContent() {
  const { assignedSubjects } = useFaculty();
  const [selectedSubject, setSelectedSubject] = React.useState("CS301");
  const [examType, setExamType] = React.useState("mid_sem_1");

  // Per-category max marks store so changing categories preserves each exam's max score independently
  const [maxMarksMap, setMaxMarksMap] = React.useState<Record<string, number>>({
    mid_sem_1: 30,
    mid_sem_2: 30,
    lab_internal: 20,
    assignment_quiz: 10,
  });

  const maxMarks = maxMarksMap[examType] ?? 30;

  function handleMaxMarksChange(val: number) {
    const validVal = Math.max(1, val);
    setMaxMarksMap((prev) => ({
      ...prev,
      [examType]: validVal,
    }));
  }

  const activeKey = `${selectedSubject}_${examType}`;

  // Store student rosters keyed by `${selectedSubject}_${examType}`
  const [allMarksMap, setAllMarksMap] = React.useState<Record<string, StudentMarkEntry[]>>({
    "CS301_mid_sem_1": INITIAL_MARKS,
  });

  // Get active roster for selected subject & exam category
  const activeMarksList = React.useMemo(() => {
    if (allMarksMap[activeKey]) {
      return allMarksMap[activeKey];
    }
    return [
      { id: "m1", rollNumber: "CSE2026-001", studentName: "Aarav Sharma", marksObtained: "", maxMarks, status: "draft" },
      { id: "m2", rollNumber: "CSE2026-002", studentName: "Aditi Patel", marksObtained: "", maxMarks, status: "draft" },
      { id: "m3", rollNumber: "CSE2026-003", studentName: "Ananya Gupta", marksObtained: "", maxMarks, status: "draft" },
      { id: "m4", rollNumber: "CSE2026-004", studentName: "Devansh Kumar", marksObtained: "", maxMarks, status: "draft" },
      { id: "m5", rollNumber: "CSE2026-005", studentName: "Ishita Verma", marksObtained: "", maxMarks, status: "draft" },
      { id: "m6", rollNumber: "CSE2026-006", studentName: "Kabir Singh", marksObtained: "", maxMarks, status: "draft" },
    ] as StudentMarkEntry[];
  }, [allMarksMap, activeKey, maxMarks]);

  const [searchQuery, setSearchQuery] = React.useState("");

  function handleMarkChange(id: string, value: string) {
    const numVal = value === "" ? "" : Math.min(Number(value) || 0, maxMarks);
    setAllMarksMap((prev) => ({
      ...prev,
      [activeKey]: activeMarksList.map((item) =>
        item.id === id ? { ...item, marksObtained: numVal } : item
      ),
    }));
  }

  function handleSaveDraft() {
    toast({
      title: "Draft Saved",
      description: `Marks saved as draft for ${selectedSubject} (${examType.replace(/_/g, " ")}).`,
    });
  }

  function handlePublishResults() {
    const publishedList = activeMarksList.map((item) => ({ ...item, status: "published" as const }));
    setAllMarksMap((prev) => ({
      ...prev,
      [activeKey]: publishedList,
    }));
    toast({
      title: "🎉 Results Published to Students!",
      description: `Marks for ${selectedSubject} (${examType.replace(/_/g, " ")}) are now visible to students.`,
    });
  }

  const filteredList = activeMarksList.filter(
    (item) =>
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  function parseCSVContent(csvText: string) {
    const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length <= 1) return;

    const parsed: StudentMarkEntry[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      const parts = line.split(",").map((p) => p.trim());
      const roll = parts[0];
      const name = parts[1];
      const marks = parts[2];

      if (roll && name) {
        parsed.push({
          id: `m_csv_${i}`,
          rollNumber: roll,
          studentName: name,
          marksObtained: Math.min(Number(marks) || 0, maxMarks),
          maxMarks: maxMarks,
          status: "published",
        });
      }
    }

    if (parsed.length > 0) {
      setAllMarksMap((prev) => ({
        ...prev,
        [activeKey]: parsed,
      }));
      toast({
        title: "⚡ Bulk CSV Marks Imported!",
        description: `Loaded marks for ${parsed.length} students live into ${selectedSubject} (${examType.replace(/_/g, " ")}).`,
      });
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) parseCSVContent(text);
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv, .txt"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            Mid-Sem & Internal Marks Entry <GraduationCap className="h-7 w-7 text-indigo-500" />
          </h1>
          <p className="text-sm text-muted-foreground">
            Class rosters are pre-populated automatically. Teachers only enter scores or bulk import from Excel/CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-1.5 text-xs border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
          >
            <Upload className="h-4 w-4" /> Upload Excel / CSV Marks Sheet
          </Button>

          <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-1.5 text-xs">
            <Save className="h-4 w-4" /> Save Draft
          </Button>

          <Button
            size="sm"
            onClick={handlePublishResults}
            className="gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm text-xs"
          >
            <Send className="h-4 w-4" /> Publish Results to Students
          </Button>
        </div>
      </div>

      {/* Control Panel: Subject & Exam Type */}
      <Card className="glass-shelf p-4">
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-indigo-500" /> Select Subject
            </label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="My Assigned Subjects" />
              </SelectTrigger>
              <SelectContent>
                {assignedSubjects.length > 0 ? (
                  assignedSubjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.code || sub.name} className="text-xs">
                      {sub.code ? `${sub.code} — ${sub.name}` : sub.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="CS301" className="text-xs">CS301 — Database Management Systems (Assigned)</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1">
              <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-500" /> Exam Category
            </label>
            <Select value={examType} onValueChange={setExamType}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mid_sem_1" className="text-xs">Mid-Semester Exam 1</SelectItem>
                <SelectItem value="mid_sem_2" className="text-xs">Mid-Semester Exam 2</SelectItem>
                <SelectItem value="lab_internal" className="text-xs">Lab Practical Internal</SelectItem>
                <SelectItem value="assignment_quiz" className="text-xs">Internal Quiz & Assignments</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Maximum Marks</label>
            <Input
              type="number"
              value={maxMarks}
              onChange={(e) => handleMaxMarksChange(Number(e.target.value) || 30)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1">
              <Search className="h-3.5 w-3.5 text-muted-foreground" /> Search Student
            </label>
            <Input
              placeholder="Roll No or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Student Marks Table */}
      <Card className="glass-shelf overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-500" /> Batch Roster — {selectedSubject} ({filteredList.length} Students)
          </CardTitle>
          <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs">
            Max Score: {maxMarks}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[120px] text-xs">Roll Number</TableHead>
                <TableHead className="text-xs">Student Name</TableHead>
                <TableHead className="w-[180px] text-xs">Marks Obtained (/{maxMarks})</TableHead>
                <TableHead className="w-[140px] text-xs">Percentage</TableHead>
                <TableHead className="w-[130px] text-xs text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.map((student) => {
                const score = Number(student.marksObtained) || 0;
                const pct = Math.round((score / maxMarks) * 100);
                const isPass = pct >= 40;

                return (
                  <TableRow key={student.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-medium text-foreground">
                      {student.rollNumber}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {student.studentName}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        max={maxMarks}
                        min={0}
                        value={student.marksObtained}
                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                        className="h-8 w-28 font-mono text-xs text-center border-indigo-500/30 focus:border-indigo-500"
                      />
                    </TableCell>
                    <TableCell>
                      <span className={`font-mono text-xs font-bold ${isPass ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                        {pct}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {student.status === "published" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[10px]">
                          <CheckCircle2 className="h-3 w-3" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground border-amber-500/40 text-amber-600 dark:text-amber-400 gap-1 text-[10px]">
                          <AlertCircle className="h-3 w-3" /> Draft
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
