"use client";

import { motion } from "framer-motion";
import { CalendarCheck2, ListChecks, NotebookText } from "lucide-react";

const POINTS = [
  {
    icon: CalendarCheck2,
    title: "Attendance that does the math",
    description: "See exactly how many classes you can skip before your percentage drops below the cutoff.",
  },
  {
    icon: ListChecks,
    title: "Assignments that don't sneak up",
    description: "Every deadline in one timeline, sorted by what's actually due next — not by which app it lives in.",
  },
  {
    icon: NotebookText,
    title: "Notes that stay organized",
    description: "Keep lecture notes tied to the right subject and semester, without folders inside folders.",
  },
];

export function ProductIntro() {
  return (
    <section className="border-t border-border/60 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="margin-tab mx-auto inline-block text-xs font-medium uppercase tracking-wider text-accent">
            Why CampusTracker
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            One quiet place instead of five noisy ones
          </h2>
          <p className="mt-4 text-muted-foreground">
            Group chats, spreadsheets, sticky notes, calendar apps — most students track their semester across too
            many places. CampusTracker brings the essentials together, privately, and gets out of your way.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <point.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
