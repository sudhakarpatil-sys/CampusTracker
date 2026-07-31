"use client";

import { motion } from "framer-motion";
import { Sparkles, Calendar, TrendingUp, CheckCircle2 } from "lucide-react";
import { useAttendance } from "@/hooks/use-attendance";
import { useAssignments } from "@/hooks/use-assignments";
import { useTimetable } from "@/hooks/use-timetable";
import { todayISODay } from "@/lib/academic";

interface DashboardHeroProps {
  firstName?: string;
}

export function DashboardHero({ firstName }: DashboardHeroProps) {
  const { overallStats } = useAttendance();
  const { assignments } = useAssignments();
  const { slotsForDay } = useTimetable();

  const pendingCount = assignments.filter((a) => a.status !== "completed").length;

  const today = todayISODay();
  const todayClasses = slotsForDay(today);

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-500/15 md:p-8"
    >
      {/* Ambient background glow elements */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-purple-400/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>CampusTracker Overview</span>
            <span className="opacity-40">•</span>
            <span className="font-mono">{todayStr}</span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {firstName ? `Welcome back, ${firstName} 👋` : "Welcome to CampusTracker 👋"}
          </h1>

          <p className="max-w-xl text-sm text-indigo-100/90 leading-relaxed">
            {todayClasses.length > 0
              ? `You have ${todayClasses.length} ${todayClasses.length === 1 ? "class" : "classes"} scheduled for today. Stay focused!`
              : "No classes scheduled for today. Great time to catch up on assignments or notes!"}
          </p>
        </div>

        {/* Hero Quick Stat Badges */}
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center lg:shrink-0">
          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md transition-all hover:bg-white/15">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-200">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-indigo-100/80">Attendance</p>
              <p className="font-mono text-lg font-semibold text-white">{overallStats.percentage}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md transition-all hover:bg-white/15">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-amber-200">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-indigo-100/80">Pending Tasks</p>
              <p className="font-mono text-lg font-semibold text-white">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
