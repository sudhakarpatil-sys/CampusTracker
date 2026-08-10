"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck2,
  ListChecks,
  CalendarClock,
  NotebookText,
  CalendarDays,
  GraduationCap,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Schedule Extraction",
    description: "Upload your syllabus PDF or image — AI parses lectures, faculty, and classroom rooms automatically.",
    accent: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    badge: "AI Powered",
  },
  {
    icon: CalendarCheck2,
    title: "Attendance Manager",
    description: "Live percentages per subject with safe-to-miss lecture counts and automated warning alerts.",
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badge: "Target Safety",
  },
  {
    icon: ListChecks,
    title: "Assignment Kanban",
    description: "Track submissions across Kanban, list, and calendar views with priority color tagging.",
    accent: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badge: "Kanban Board",
  },
  {
    icon: CalendarClock,
    title: "Interactive Timetable",
    description: "Your weekly lecture schedule with drag-and-drop time snapping and classroom location pills.",
    accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badge: "Drag & Drop",
  },
  {
    icon: NotebookText,
    title: "Subject Notes",
    description: "Subject-linked markdown notes with instant search, code blocks, and revision timestamps.",
    accent: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    badge: "Markdown",
  },
  {
    icon: CalendarDays,
    title: "Unified Master Calendar",
    description: "Classes, assignment deadlines, and college events merged onto a single timeline.",
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badge: "Master View",
  },
  {
    icon: GraduationCap,
    title: "Exam Countdown",
    description: "Countdown timer to every midterm and final exam alongside syllabus revision checklists.",
    accent: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30",
    badge: "Countdown",
  },
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    description: "Row-level security encryption ensures your academic data is private and yours alone.",
    accent: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badge: "Encrypted",
  },
];

export function Features() {
  return (
    <section id="features" className="relative border-t border-border/60 bg-muted/20 py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Complete Academic Suite</span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Everything you need to conquer your semester
          </h2>

          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Stop switching between five different apps. CampusTracker connects your schedule, tasks, attendance, and notes into one seamless operating system.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
                className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-200 hover:border-indigo-500/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110", feature.accent)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-sm font-bold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
