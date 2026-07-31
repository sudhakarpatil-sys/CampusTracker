"use client";

import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Layers } from "lucide-react";

export function CalendarHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-700 p-6 text-white shadow-xl shadow-purple-500/15 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-indigo-400/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <CalendarIcon className="h-3.5 w-3.5 text-purple-200" />
            <span>Unified Timeline</span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Master Calendar
          </h1>

          <p className="max-w-xl text-sm text-purple-100/90 leading-relaxed">
            Assignments, exams, events, and lecture schedules combined into a single interactive calendar.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
