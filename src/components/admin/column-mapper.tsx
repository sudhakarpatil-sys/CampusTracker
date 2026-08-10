"use client";

import * as React from "react";
import { Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { FieldMapping } from "@/types/sync";

export interface TargetSchemaField {
  name: string;
  label: string;
  required?: boolean;
}

const DATASET_SCHEMAS: Record<string, TargetSchemaField[]> = {
  student_master: [
    { name: "rollNumber", label: "Roll Number", required: true },
    { name: "studentId", label: "Student ID / Enrollment", required: true },
    { name: "fullName", label: "Student Full Name", required: true },
    { name: "officialEmail", label: "Official Email Address" },
  ],
  attendance: [
    { name: "rollNumber", label: "Student Roll Number", required: true },
    { name: "subjectCode", label: "Subject Code", required: true },
    { name: "classDate", label: "Class Date (YYYY-MM-DD)", required: true },
    { name: "status", label: "Attendance Status (present/absent/excused)" },
  ],
  internal_marks: [
    { name: "rollNumber", label: "Student Roll Number", required: true },
    { name: "subjectCode", label: "Subject Code", required: true },
    { name: "testName", label: "Test / Assessment Name", required: true },
    { name: "marksObtained", label: "Marks Obtained", required: true },
    { name: "maxMarks", label: "Maximum Marks", required: true },
  ],
};

interface ColumnMapperProps {
  datasetType: string;
  detectedHeaders?: string[];
  fieldMappings: FieldMapping[];
  onChange: (mappings: FieldMapping[]) => void;
}

export function ColumnMapper({ datasetType, detectedHeaders = [], fieldMappings, onChange }: ColumnMapperProps) {
  const schema = DATASET_SCHEMAS[datasetType] || DATASET_SCHEMAS.student_master || [];

  // Initialize mappings for required schema fields if empty
  React.useEffect(() => {
    if (fieldMappings.length === 0 && schema.length > 0) {
      const initial: FieldMapping[] = schema.map((f) => {
        // Try exact/fuzzy header match
        const matched = detectedHeaders.find(
          (h) => h.toLowerCase() === f.name.toLowerCase() || h.toLowerCase() === f.label.toLowerCase()
        );
        return {
          sourceColumn: matched || f.label,
          targetField: f.name,
          isRequired: f.required,
          transform: "trim",
        };
      });
      onChange(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetType]);

  function handleSourceChange(index: number, value: string) {
    const next = fieldMappings.map((item, i) =>
      i === index ? { ...item, sourceColumn: value } : item
    );
    onChange(next);
  }

  function handleTargetChange(index: number, value: string) {
    const targetFieldDef = schema.find((s) => s.name === value);
    const next = fieldMappings.map((item, i) =>
      i === index
        ? {
            ...item,
            targetField: value,
            isRequired: targetFieldDef?.required ?? false,
          }
        : item
    );
    onChange(next);
  }

  function handleTransformChange(index: number, value: any) {
    const next = fieldMappings.map((item, i) =>
      i === index ? { ...item, transform: value } : item
    );
    onChange(next);
  }

  function addRow() {
    onChange([
      ...fieldMappings,
      { sourceColumn: "", targetField: schema[0]?.name || "field", isRequired: false, transform: "trim" },
    ]);
  }

  function removeRow(index: number) {
    onChange(fieldMappings.filter((_, i) => i !== index));
  }

  // Check required schema fields mapped
  const missingRequired = schema.filter(
    (req) => req.required && !fieldMappings.some((m) => m.targetField === req.name && m.sourceColumn.trim())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Dataset Column Mapping</h3>
          <p className="text-xs text-muted-foreground">
            Map source spreadsheet headers to CampusTracker target schema fields.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={addRow} className="h-8 text-xs">
          <Plus className="mr-1 h-3.5 w-3.5" /> Add Mapping
        </Button>
      </div>

      {missingRequired.length > 0 ? (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Missing required mapping for: <strong>{missingRequired.map((f) => f.label).join(", ")}</strong>
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>All required dataset fields are validly mapped!</span>
        </div>
      )}

      <div className="space-y-2">
        {fieldMappings.map((mapping, idx) => (
          <div key={idx} className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 p-2.5">
            {/* Source Column Input/Dropdown */}
            <div className="flex-1 min-w-[140px]">
              <label className="text-[10px] uppercase font-mono text-muted-foreground">Source Header</label>
              {detectedHeaders.length > 0 ? (
                <Select value={mapping.sourceColumn} onValueChange={(val) => handleSourceChange(idx, val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select header..." />
                  </SelectTrigger>
                  <SelectContent>
                    {detectedHeaders.map((h) => (
                      <SelectItem key={h} value={h} className="text-xs">
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={mapping.sourceColumn}
                  onChange={(e) => handleSourceChange(idx, e.target.value)}
                  placeholder="e.g. Enrollment No"
                  className="h-8 text-xs"
                />
              )}
            </div>

            <span className="text-xs text-muted-foreground font-mono mt-4">→</span>

            {/* Target Field Selector */}
            <div className="flex-1 min-w-[140px]">
              <label className="text-[10px] uppercase font-mono text-muted-foreground">Target Field</label>
              <Select value={mapping.targetField} onValueChange={(val) => handleTargetChange(idx, val)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select target field..." />
                </SelectTrigger>
                <SelectContent>
                  {schema.map((f) => (
                    <SelectItem key={f.name} value={f.name} className="text-xs">
                      {f.label} {f.required ? "*" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transform selection */}
            <div className="w-28">
              <label className="text-[10px] uppercase font-mono text-muted-foreground">Transform</label>
              <Select
                value={mapping.transform || "trim"}
                onValueChange={(val) => handleTransformChange(idx, val)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trim" className="text-xs">Trim</SelectItem>
                  <SelectItem value="uppercase" className="text-xs">UPPERCASE</SelectItem>
                  <SelectItem value="date_iso" className="text-xs">ISO Date</SelectItem>
                  <SelectItem value="number" className="text-xs">Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeRow(idx)}
              className="h-8 w-8 mt-4 text-muted-foreground hover:text-rose-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
