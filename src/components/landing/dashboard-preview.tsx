"use client";

import { motion } from "framer-motion";
import { CalendarCheck2, Flame, TrendingUp, Sparkles, CheckCircle2, Clock } from "lucide-react";

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-4xl rounded-2xl border border-white/20 bg-card/80 p-2 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl dark:border-white/10"
    >
      {/* Top Edge Highlight */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      {/* App Window Header Bar */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500/80" />
          <span className="h-3 w-3 rounded-full bg-amber-500/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-[11px] text-muted-foreground">app.campustracker.io/dashboard</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium text-indigo-500">
          <Sparkles className="h-3 w-3" /> Live Demo Mode
        </div>
      </div>

      {/* Dashboard Main Mockup */}
      <div className="rounded-xl border border-border/60 bg-card p-5 sm:p-7">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-mono text-xs text-muted-foreground">Thursday, Oct 24</span>
            <h3 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Welcome back, Alex 👋
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              88% Attendance Target
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Attendance */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                <CalendarCheck2 className="h-3.5 w-3.5" /> Attendance
              </span>
              <span className="font-mono text-[10px] text-indigo-500">Safe Zone</span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground">88%</p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted/60">
              <motion.div
                className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: "88%" }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </div>

          {/* Card 2: Tasks Due */}
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
                <Clock className="h-3.5 w-3.5" /> Assignments
              </span>
              <span className="font-mono text-[10px] text-rose-500">3 Pending</span>
            </div>
            <p className="mt-2 font-display text-base font-semibold text-foreground truncate">Data Structures Lab</p>
            <p className="mt-1 text-xs text-muted-foreground font-mono">Due Tomorrow at 11:59 PM</p>
          </div>

          {/* Card 3: Today's Schedule */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                <Flame className="h-3.5 w-3.5" /> Next Class
              </span>
              <span className="font-mono text-[10px] text-amber-500">10:00 AM</span>
            </div>
            <p className="mt-2 font-display text-base font-semibold text-foreground truncate">Operating Systems</p>
            <p className="mt-1 text-xs text-muted-foreground">Hall 302 • Prof. Sharma</p>
          </div>

          {/* Card 4: Status */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Semester Status
              </span>
              <span className="font-mono text-[10px] text-emerald-500">On Track</span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground">5 / 5</p>
            <p className="mt-1 text-xs text-muted-foreground">All courses meeting targets</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
