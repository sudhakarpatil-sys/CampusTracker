"use client";

import * as React from "react";
import { Database, CheckCircle2, Clock, Sparkles, Table as TableIcon, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DatasetSpec {
  key: string;
  name: string;
  targetTable: string;
  status: "active" | "planned";
  description: string;
  requiredFields: string[];
}

const DATASETS: DatasetSpec[] = [
  {
    key: "student_master",
    name: "Student Master Registry",
    targetTable: "student_master",
    status: "active",
    description: "Official institutional registry of enrolled students, roll numbers, departments, and emails.",
    requiredFields: ["rollNumber", "studentId", "fullName"],
  },
  {
    key: "attendance",
    name: "Attendance Records",
    targetTable: "attendance_records",
    status: "active",
    description: "Daily class attendance logs synced per student, subject code, and date.",
    requiredFields: ["rollNumber", "subjectCode", "classDate"],
  },
  {
    key: "internal_marks",
    name: "Internal Assessment Marks",
    targetTable: "internal_marks",
    status: "active",
    description: "Midterms, lab tests, assignment marks, and internal academic scoring.",
    requiredFields: ["rollNumber", "subjectCode", "testName", "marksObtained"],
  },
  {
    key: "semester_results",
    name: "Semester Results & GPA",
    targetTable: "semester_results",
    status: "active",
    description: "Official end-of-semester SGPA, CGPA, earned credits, and backlog counters.",
    requiredFields: ["rollNumber", "semester", "sgpa", "cgpa"],
  },
  {
    key: "academic_calendar",
    name: "Academic Calendar & Holidays",
    targetTable: "academic_calendar",
    status: "active",
    description: "Official institutional term dates, exam schedules, and recognized holidays.",
    requiredFields: ["title", "eventType", "startDate"],
  },
  {
    key: "faculty",
    name: "Faculty Directory",
    targetTable: "profiles",
    status: "planned",
    description: "Professors, teaching assistants, department heads, and course assignments.",
    requiredFields: ["facultyId", "fullName", "department"],
  },
  {
    key: "timetable",
    name: "Master Timetable Grid",
    targetTable: "timetable_slots",
    status: "planned",
    description: "Institutional lecture schedules, classroom allocations, and day-of-week slots.",
    requiredFields: ["subjectCode", "dayOfWeek", "startTime"],
  },
];

export function DatasetConfigContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Academic Dataset Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Dataset-agnostic adapter specifications supported by the CampusTracker Sync Engine.
        </p>
      </div>

      {/* Dataset Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DATASETS.map((dataset) => (
          <Card key={dataset.key} className="glass-shelf flex flex-col justify-between overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    dataset.status === "active" ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "bg-muted text-muted-foreground"
                  )}>
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{dataset.name}</h3>
                    <p className="text-[11px] font-mono text-muted-foreground">Table: {dataset.targetTable}</p>
                  </div>
                </div>
                <Badge
                  variant={dataset.status === "active" ? "secondary" : "outline"}
                  className={cn(
                    "text-[10px] uppercase font-mono tracking-wider",
                    dataset.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "text-muted-foreground"
                  )}
                >
                  {dataset.status === "active" ? "Active Adapter" : "Planned"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-4">
              <p className="text-xs text-muted-foreground leading-relaxed">{dataset.description}</p>

              <div className="rounded-xl border border-border/50 bg-muted/20 p-2.5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-muted-foreground font-semibold">Required Schema Keys</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {dataset.requiredFields.map((field) => (
                    <Badge key={field} variant="outline" className="text-[9px] font-mono bg-background">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
