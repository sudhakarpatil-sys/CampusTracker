"use client";

import { motion } from "framer-motion";
import { CheckSquare, CheckCircle2, Circle } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";

export function TasksHero() {
  const { pendingTasks, completedTasks } = useTasks();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 p-6 text-white shadow-xl shadow-sky-500/15 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-cyan-400/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <CheckSquare className="h-3.5 w-3.5 text-cyan-200" />
            <span>Task Management</span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            To-Do & Quick Tasks
          </h1>

          <p className="max-w-xl text-sm text-sky-100/90 leading-relaxed">
            Keep track of personal study goals, sub-tasks, and quick action items in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-200">
              <Circle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-sky-100/80">Pending Tasks</p>
              <p className="font-mono text-lg font-semibold text-white">{pendingTasks.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-400/20 text-sky-200">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-sky-100/80">Completed</p>
              <p className="font-mono text-lg font-semibold text-white">{completedTasks.length}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
