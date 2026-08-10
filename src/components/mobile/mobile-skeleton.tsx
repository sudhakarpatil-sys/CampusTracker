"use client";

import * as React from "react";

export function MobileSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-800/60 rounded-xl ${className}`} />
  );
}

export function MobileDashboardSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Attendance Hero Card Skeleton */}
      <div className="h-44 bg-slate-800/60 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="h-4 w-28 bg-slate-700/60 rounded-lg" />
        <div className="h-10 w-36 bg-slate-700/60 rounded-lg" />
        <div className="h-8 w-full bg-slate-700/40 rounded-xl" />
      </div>

      {/* Quick Access Pills Skeleton */}
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-slate-800/60 border border-slate-800 rounded-xl" />
        ))}
      </div>

      {/* Classes Timeline Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-slate-700/60 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-slate-800/60 border border-slate-800 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
