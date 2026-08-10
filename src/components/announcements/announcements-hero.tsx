"use client";

import { motion } from "framer-motion";
import { Megaphone, Bell, Pin, MessageSquare } from "lucide-react";

export function AnnouncementsHero() {
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-700 p-6 text-white shadow-xl shadow-pink-500/15 md:p-8"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <Megaphone className="h-3.5 w-3.5 text-amber-300" />
            <span>Announcements</span>
            <span className="opacity-40">•</span>
            <span className="font-mono">{todayStr}</span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Stay Updated 📢
          </h1>

          <p className="max-w-xl text-sm text-pink-100/90 leading-relaxed">
            Official announcements from your college, department, and faculty.
            Important notices are pinned at the top.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center lg:shrink-0">
          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md transition-all hover:bg-white/15">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-amber-200">
              <Pin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-pink-100/80">Pinned</p>
              <p className="font-mono text-lg font-semibold text-white">—</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md transition-all hover:bg-white/15">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-200">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-pink-100/80">Total</p>
              <p className="font-mono text-lg font-semibold text-white">—</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
