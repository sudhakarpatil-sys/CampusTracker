"use client";

import * as React from "react";
import { ShieldCheck, TrendingUp, Calendar, AlertCircle } from "lucide-react";

interface AttendanceProgressRingProps {
  percentage: number;
  presents: number;
  totalClasses: number;
  absences: number;
  target?: number;
  safeLeaves?: number;
  syncTimestamp?: string;
  onViewDetails?: () => void;
  className?: string;
}

export function AttendanceProgressRing({
  percentage,
  presents,
  totalClasses,
  absences,
  target = 75,
  safeLeaves = 0,
  syncTimestamp,
  onViewDetails,
  className = "",
}: AttendanceProgressRingProps) {
  const roundedPercentage = Math.round(percentage);
  const isSafe = roundedPercentage >= target;

  // SVG ring calculations
  const size = 90;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (roundedPercentage / 100) * circumference;

  return (
    <div 
      onClick={onViewDetails}
      className={`relative bg-gradient-to-br from-[#1E2536] via-[#161D2B] to-[#111622] border border-purple-500/20 rounded-2xl p-4 shadow-xl transition-all hover:border-purple-500/40 cursor-pointer overflow-hidden ${className}`}
    >
      {/* Background Ambient Tint */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
            <Calendar className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-purple-300">Attendance</h3>
            <p className="text-[10px] text-slate-400 font-medium">Official Institution Record</p>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
          isSafe 
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" 
            : "bg-amber-500/15 text-amber-400 border-amber-500/20"
        }`}>
          {isSafe ? "On Track" : "Action Needed"}
        </span>
      </div>

      {/* Main Grid: Info Left, SVG Gauge Right */}
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Left Stats */}
        <div className="col-span-7 space-y-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
              {roundedPercentage}%
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +5%
            </span>
          </div>

          <p className="text-xs text-slate-300 font-medium line-clamp-1">
            {isSafe ? "Keep it up, you're doing great!" : `Goal: Reach ${target}% threshold`}
          </p>

          {/* Safe-Leave Badge Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/15 text-[11px] font-medium text-purple-300">
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
            <span>Safe Leaves: <strong className="text-white font-bold">{safeLeaves}</strong> classes</span>
          </div>
        </div>

        {/* Right SVG Progress Arc */}
        <div className="col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background Track Circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#2A3447"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress Arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#purpleGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-sm font-black text-white">{roundedPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Chips Row */}
      <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-800/80 text-center">
        <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <span className="block text-[10px] text-slate-400 font-medium">Presents</span>
          <span className="block text-xs font-bold text-emerald-400 mt-0.5">{presents}</span>
        </div>
        <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <span className="block text-[10px] text-slate-400 font-medium">Total Classes</span>
          <span className="block text-xs font-bold text-white mt-0.5">{totalClasses}</span>
        </div>
        <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <span className="block text-[10px] text-slate-400 font-medium">Absences</span>
          <span className="block text-xs font-bold text-rose-400 mt-0.5">{absences}</span>
        </div>
      </div>
    </div>
  );
}
