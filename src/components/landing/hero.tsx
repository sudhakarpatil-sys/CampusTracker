"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/landing/dashboard-preview";

export function Hero() {
  return (
    <section id="product" className="relative overflow-hidden pb-20 pt-12 sm:pt-20">
      {/* Ambient Radial Mesh Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(99,102,241,0.22),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-40 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl"
      />

      <div className="container flex flex-col items-center text-center">
        {/* Animated Glass Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 backdrop-blur-md shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Reimagined Academic OS</span>
          <span className="opacity-40">•</span>
          <span className="font-mono text-[11px]">Free for Students</span>
        </motion.div>

        {/* Editorial Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-4xl font-display text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl text-foreground"
        >
          Your entire academic life,{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent italic">
            effortlessly organized.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 max-w-2xl text-balance text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          Attendance, assignments, timetable schedules, exams, and notes — tracked privately in one calm, high-performance workspace.
        </motion.p>

        {/* CTA Button Group */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
        >
          <Button
            size="lg"
            className="h-12 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-8 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500"
            asChild
          >
            <Link href="/signup">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-12 border-border/80 px-7 text-sm font-medium hover:bg-muted/50"
            asChild
          >
            <a href="#features">
              <PlayCircle className="mr-2 h-4 w-4 text-indigo-500" /> Explore Features
            </a>
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 flex items-center gap-6 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> No credit card required
          </span>
          <span>•</span>
          <span>Private & Secure</span>
        </motion.div>

        {/* 3D Dashboard Preview Box */}
        <div className="mt-14 w-full max-w-5xl">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
