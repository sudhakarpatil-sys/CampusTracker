"use client";

import { motion } from "framer-motion";
import { CalendarClock, Sparkles, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTimetable } from "@/hooks/use-timetable";
import { useSubjects } from "@/hooks/use-subjects";
import { todayISODay } from "@/lib/academic";

export function TimetableHero() {
  const { slots, slotsForDay } = useTimetable();
  const { subjects } = useSubjects();

  const today = todayISODay();
  const todayClasses = slotsForDay(today);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/15 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-blue-400/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <CalendarClock className="h-3.5 w-3.5 text-blue-200" />
            <span>Weekly Schedule</span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Interactive Timetable
          </h1>

          <p className="max-w-xl text-sm text-indigo-100/90 leading-relaxed">
            Build your weekly schedule once — drag lectures to adjust timing, or let AI automatically extract your syllabus schedule.
          </p>

          <div className="pt-2">
            <Button size="sm" className="bg-white text-indigo-700 hover:bg-white/90 shadow-md font-semibold text-xs" asChild>
              <Link href="/timetable/import">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-indigo-600" /> Import Schedule with AI
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-400/20 text-blue-200">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-indigo-100/80">Weekly Lectures</p>
              <p className="font-mono text-lg font-semibold text-white">{slots.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-400/20 text-indigo-200">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-indigo-100/80">Subjects</p>
              <p className="font-mono text-lg font-semibold text-white">{subjects.length}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
