"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function MobileErrorState({
  title = "Something Went Wrong",
  message = "We couldn't load the data. Please try again.",
  onRetry,
  className = "",
}: MobileErrorStateProps) {
  return (
    <div className={`bg-gradient-to-br from-[#1E1924] via-[#181F2E] to-[#141923] border border-rose-500/20 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
        <AlertCircle className="h-7 w-7" />
      </div>

      <div className="space-y-1 max-w-xs">
        <h4 className="font-bold text-base text-white tracking-tight">{title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-2 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs rounded-xl px-4 h-9 gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Try Again
        </Button>
      )}
    </div>
  );
}
