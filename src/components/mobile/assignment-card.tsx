"use client";

import * as React from "react";
import { AlertCircle, Clock, CheckCircle2, FileText } from "lucide-react";
import type { Assignment } from "@/types/database.types";

interface AssignmentCardProps {
  assignment: Assignment;
  subjectName?: string;
  onSelect?: (assignment: Assignment) => void;
  className?: string;
}

export function AssignmentCard({
  assignment,
  subjectName,
  onSelect,
  className = "",
}: AssignmentCardProps) {
  const getPriorityStyle = (priority: Assignment["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-rose-500/15 text-rose-400 border-rose-500/20";
      case "medium":
        return "bg-amber-500/15 text-amber-400 border-amber-500/20";
      case "low":
        return "bg-blue-500/15 text-blue-400 border-blue-500/20";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  const getStatusStyle = (status: Assignment["status"]) => {
    switch (status) {
      case "submitted":
      case "completed":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
      case "in_progress":
        return "bg-purple-500/15 text-purple-300 border-purple-500/20";
      default:
        return "bg-amber-500/15 text-amber-300 border-amber-500/20";
    }
  };

  return (
    <div
      onClick={() => onSelect?.(assignment)}
      className={`bg-gradient-to-br from-[#181F2E] to-[#141923] border border-slate-800/80 rounded-2xl p-4 shadow-lg transition-all hover:border-purple-500/40 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* Left Icon Pill */}
        <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-400 shrink-0">
          <FileText className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-sm text-white tracking-tight line-clamp-1">
              {assignment.title}
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityStyle(assignment.priority)}`}>
              {assignment.priority}
            </span>
          </div>

          {subjectName && (
            <p className="text-xs text-purple-300 font-medium line-clamp-1">{subjectName}</p>
          )}

          <div className="flex items-center justify-between pt-1">
            {assignment.due_date ? (
              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Due: {assignment.due_date} {assignment.due_time ? `@ ${assignment.due_time}` : ""}</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">No due date set</span>
            )}

            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusStyle(assignment.status)}`}>
              {assignment.status.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
