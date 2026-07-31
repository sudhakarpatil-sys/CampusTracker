"use client";

import { motion } from "framer-motion";
import { PartyPopper, Calendar, Sparkles } from "lucide-react";
import { useEvents } from "@/hooks/use-events";

export function EventsHero() {
  const { events } = useEvents();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 p-6 text-white shadow-xl shadow-amber-500/15 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-amber-400/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <PartyPopper className="h-3.5 w-3.5 text-amber-200" />
            <span>Campus Events & Activities</span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Events & Calendar
          </h1>

          <p className="max-w-xl text-sm text-amber-100/90 leading-relaxed">
            College fests, technical workshops, hackathons, club meetings, and extracurricular milestones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-amber-200">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-amber-100/80">Upcoming Events</p>
              <p className="font-mono text-lg font-semibold text-white">{events.length}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
