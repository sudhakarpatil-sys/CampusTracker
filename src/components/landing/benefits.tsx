"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const BENEFITS = [
  "No more mentally recalculating your attendance percentage before skipping a lecture.",
  "One unified dashboard instead of juggling WhatsApp groups, Notion, and spreadsheets.",
  "Your academic data stays completely private — secured with Supabase Row Level Security.",
  "Built for your entire engineering or college journey: from freshman year to final viva.",
];

export function Benefits() {
  return (
    <section id="benefits" className="border-t border-border/60 py-24 bg-card/40">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Built For Real Semesters</span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Less scrambling before class, more clarity all week
          </h2>

          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            CampusTracker was designed around the actual rhythm of a college week — attendance safety targets, assignment deadlines, and exam crunch periods.
          </p>
        </div>

        <div className="space-y-3.5">
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-start gap-3.5 rounded-xl border border-border/60 bg-card p-4.5 shadow-sm transition-all duration-200 hover:border-emerald-500/40 hover:shadow-md"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Check className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium text-foreground leading-relaxed">{benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
