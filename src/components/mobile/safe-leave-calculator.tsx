"use client";

import * as React from "react";
import { ShieldCheck, AlertCircle, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SafeLeaveCalculatorProps {
  attended: number;
  total: number;
  target?: number; // Default 75%
  subjectName?: string;
  onClose?: () => void;
}

export function SafeLeaveCalculator({
  attended,
  total,
  target = 75,
  subjectName,
  onClose,
}: SafeLeaveCalculatorProps) {
  const [simulatedMissed, setSimulatedMissed] = React.useState(0);

  const targetDecimal = target / 100;
  const currentPercentage = total > 0 ? (attended / total) * 100 : 0;

  // Max safe leave calculation formula
  const safeLeavesCount = Math.max(
    0,
    Math.floor((attended - targetDecimal * total) / (1 - targetDecimal))
  );

  // Calculate simulated percentage
  const simTotal = total + simulatedMissed;
  const simPercentage = simTotal > 0 ? (attended / simTotal) * 100 : 0;
  const isSimSafe = simPercentage >= target;

  return (
    <div className="bg-gradient-to-br from-[#1A2030] via-[#141923] to-[#121620] border border-purple-500/20 rounded-2xl p-4 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-bold text-sm text-white">Safe-Leave Engine™</h3>
            <p className="text-[11px] text-slate-400">
              {subjectName ? `Subject: ${subjectName}` : "Overall Academic Attendance"}
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/20">
          Target: {target}%
        </span>
      </div>

      {/* Primary Result Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors ${
        safeLeavesCount > 0 
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" 
          : "bg-amber-500/10 border-amber-500/20 text-amber-300"
      }`}>
        <div className={`p-2 rounded-xl flex items-center justify-center ${
          safeLeavesCount > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
        }`}>
          {safeLeavesCount > 0 ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
        </div>
        <div>
          <h4 className="font-bold text-sm text-white">
            {safeLeavesCount > 0 
              ? `You can safely miss ${safeLeavesCount} more lecture${safeLeavesCount > 1 ? "s" : ""}`
              : "No safe leave buffer remaining"
            }
          </h4>
          <p className="text-xs opacity-90 mt-0.5">
            {safeLeavesCount > 0 
              ? `You will remain at or above the ${target}% official college requirement.`
              : `Attend all upcoming classes to recover your attendance to ${target}%.`
            }
          </p>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Simulate missed upcoming classes:
          </span>
          <span className="font-bold text-purple-400 text-sm">{simulatedMissed} lectures</span>
        </div>

        <input
          type="range"
          min="0"
          max="10"
          value={simulatedMissed}
          onChange={(e) => setSimulatedMissed(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />

        {/* Simulation Output Card */}
        <div className="grid grid-cols-2 gap-2 text-center pt-2">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="block text-[10px] text-slate-400 font-medium">Current Attendance</span>
            <span className="block text-sm font-bold text-white mt-0.5">{Math.round(currentPercentage)}%</span>
            <span className="block text-[10px] text-slate-500">({attended} / {total} classes)</span>
          </div>

          <div className={`p-2.5 rounded-xl border ${
            isSimSafe ? "bg-slate-900/80 border-purple-500/30" : "bg-rose-950/40 border-rose-500/30"
          }`}>
            <span className="block text-[10px] text-slate-400 font-medium">Simulated Result</span>
            <span className={`block text-sm font-bold mt-0.5 ${isSimSafe ? "text-purple-400" : "text-rose-400"}`}>
              {Math.round(simPercentage)}%
            </span>
            <span className="block text-[10px] text-slate-500">({attended} / {simTotal} classes)</span>
          </div>
        </div>
      </div>

      {onClose && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="w-full h-9 rounded-xl border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
        >
          Close Simulator
        </Button>
      )}
    </div>
  );
}
