"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const BENEFITS = [
  "No more mentally recalculating your attendance percentage before every class",
  "One dashboard instead of switching between five apps and a notebook",
  "Your academic data stays private — row-level security, not a shared spreadsheet",
  "Built to grow with you: from first semester through to your final viva",
];

export function Benefits() {
  return (
    <section id="benefits" className="border-t border-border/60 py-20">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-accent">Built for real semesters</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Less scrambling before class, more clarity all week
          </h2>
          <p className="mt-4 text-muted-foreground">
            CampusTracker was designed around the actual rhythm of a college week — attendance cutoffs, assignment
            deadlines, and the exam crunch — not generic productivity theory.
          </p>
        </div>

        <div className="space-y-4">
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm">{benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
