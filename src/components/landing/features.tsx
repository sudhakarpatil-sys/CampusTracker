"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck2,
  ListChecks,
  CalendarClock,
  NotebookText,
  CalendarDays,
  GraduationCap,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  { icon: CalendarCheck2, title: "Attendance tracking", description: "Live percentages per subject, with safe-to-miss counts." },
  { icon: ListChecks, title: "Assignment manager", description: "Track submissions, due dates, and priority in one list." },
  { icon: CalendarClock, title: "Timetable", description: "Your weekly schedule, always one glance away." },
  { icon: NotebookText, title: "Notes", description: "Lightweight, subject-linked notes for lecture recall." },
  { icon: CalendarDays, title: "Calendar", description: "Classes, deadlines, and exams on a single timeline." },
  { icon: GraduationCap, title: "Exam tracker", description: "Countdown to every exam with prep checklists." },
  { icon: BarChart3, title: "Analytics", description: "Study patterns and productivity trends over the semester." },
  { icon: ShieldCheck, title: "Private by design", description: "Row-level security means your data is yours alone." },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border/60 bg-surface/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">Everything, in one binder</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Built for the whole semester</h2>
          <p className="mt-4 text-muted-foreground">
            Phase one lays the foundation — secure accounts, a real dashboard, and a place for every feature below to
            plug into as it ships.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
              className="margin-tab rounded-xl border border-border bg-surface p-5"
            >
              <feature.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-3 font-display text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
