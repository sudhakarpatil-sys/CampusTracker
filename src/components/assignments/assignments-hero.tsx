"use client";

import { motion } from "framer-motion";
import { ListChecks, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useAssignments } from "@/hooks/use-assignments";

export function AssignmentsHero() {
  const { assignments } = useAssignments();

  const pendingAssignments = assignments.filter((a) => a.status !== "completed");
  const completedAssignments = assignments.filter((a) => a.status === "completed");
  const highPriorityCount = pendingAssignments.filter((a) => a.priority === "high").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 p-6 text-white shadow-xl shadow-pink-500/15 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-rose-400/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <ListChecks className="h-3.5 w-3.5 text-rose-200" />
            <span>Assignments & Deadlines</span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Assignments Hub
          </h1>

          <p className="max-w-xl text-sm text-pink-100/90 leading-relaxed">
            Manage your academic deliverables across Kanban, list, and calendar views with priority tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-400/20 text-rose-200">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-pink-100/80">Pending</p>
              <p className="font-mono text-lg font-semibold text-white">{pendingAssignments.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-400/20 text-pink-200">
              {highPriorityCount > 0 ? <AlertCircle className="h-5 w-5 text-amber-200" /> : <CheckCircle2 className="h-5 w-5 text-emerald-200" />}
            </div>
            <div>
              <p className="text-xs font-medium text-pink-100/80">High Priority</p>
              <p className="font-mono text-lg font-semibold text-white">{highPriorityCount}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
