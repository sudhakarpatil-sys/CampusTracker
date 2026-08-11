"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAttendance } from "@/hooks/use-attendance";
import { useSubjects } from "@/hooks/use-subjects";

export function AttendanceHero() {
  const { overallStats, statsBySubject } = useAttendance();
  const { subjects } = useSubjects();

  const belowTarget = subjects.filter((s) => (statsBySubject.get(s.id)?.percentage ?? 100) < s.attendance_target);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white shadow-xl shadow-teal-500/15 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-emerald-400/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-200" />
            <span>Attendance Manager</span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Attendance & Analytics
          </h1>

          <p className="max-w-xl text-sm text-teal-100/90 leading-relaxed">
            Track official attendance stats, subject trends, and threshold targets synced directly from institutional ERP data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-200">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-teal-100/80">Overall Rate</p>
              <p className="font-mono text-lg font-semibold text-white">{overallStats.percentage}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-400/20 text-teal-200">
              {belowTarget.length > 0 ? <AlertTriangle className="h-5 w-5 text-amber-200" /> : <ShieldCheck className="h-5 w-5 text-emerald-200" />}
            </div>
            <div>
              <p className="text-xs font-medium text-teal-100/80">Target Status</p>
              <p className="font-mono text-lg font-semibold text-white">
                {belowTarget.length > 0 ? `${belowTarget.length} At Risk` : "All Targets Met"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
