"use client";

import { motion } from "framer-motion";
import { CalendarCheck2, Flame, TrendingUp } from "lucide-react";

/**
 * The landing page's signature element: a notebook-page mockup of the real
 * dashboard, complete with margin tabs (see .margin-tab in globals.css) so
 * the preview reads like a page from an actual student's binder rather than
 * a generic "browser window" screenshot.
 */
export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      className="glass relative mx-auto w-full max-w-3xl rounded-2xl p-2 shadow-2xl"
    >
      <div className="rounded-xl border border-border bg-surface p-5 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="margin-tab">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">This week</p>
            <p className="font-display text-lg font-semibold">Good evening, Aditi</p>
          </div>
          <div className="flex -space-x-2">
            {["bg-accent", "bg-primary", "bg-success"].map((c, i) => (
              <span key={i} className={`h-7 w-7 rounded-full border-2 border-surface ${c}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="margin-tab rounded-lg border border-border bg-surface-raised p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarCheck2 className="h-3.5 w-3.5" /> Attendance
            </div>
            <p className="mt-2 font-display text-2xl font-semibold">87%</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
              <motion.div
                className="h-1.5 rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: "87%" }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </div>

          <div className="margin-tab rounded-lg border border-border bg-surface-raised p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Flame className="h-3.5 w-3.5" /> Study streak
            </div>
            <p className="mt-2 font-display text-2xl font-semibold">12 days</p>
            <p className="mt-2 text-xs text-muted-foreground">Personal best: 19</p>
          </div>

          <div className="margin-tab rounded-lg border border-border bg-surface-raised p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground">Due tomorrow</p>
            <p className="mt-2 truncate font-display text-sm font-semibold">Thermodynamics problem set</p>
            <p className="mt-2 text-xs text-accent">2 assignments left</p>
          </div>

          <div className="margin-tab rounded-lg border border-border bg-surface-raised p-4 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" /> Productivity
            </div>
            <p className="mt-2 font-display text-2xl font-semibold">Solid week</p>
            <p className="mt-2 text-xs text-muted-foreground">4 of 6 goals on track</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
