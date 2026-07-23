"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/landing/dashboard-preview";

export function Hero() {
  return (
    <section id="product" className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--accent)/0.16),transparent)]"
      />
      <div className="container flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="margin-tab mb-6 inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          Built for the semester grind
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl"
        >
          Your entire academic life, <em className="italic text-accent">kept in the margins</em> of one calm app.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 max-w-xl text-balance text-lg text-muted-foreground"
        >
          Attendance, assignments, timetable, exams, and notes — tracked privately, so you can stop juggling five apps
          and get back to studying.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button size="lg" asChild>
            <Link href="/signup">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#features">
              <PlayCircle className="h-4 w-4" /> See how it works
            </a>
          </Button>
        </motion.div>

        <div className="mt-16 w-full">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
