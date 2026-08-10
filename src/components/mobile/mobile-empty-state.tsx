"use client";

import * as React from "react";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileEmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function MobileEmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: MobileEmptyStateProps) {
  return (
    <div className={`bg-gradient-to-br from-[#181F2E] to-[#141923] border border-slate-800/80 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
        <Icon className="h-7 w-7" />
      </div>

      <div className="space-y-1 max-w-xs">
        <h4 className="font-bold text-base text-white tracking-tight">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button
          size="sm"
          onClick={onAction}
          className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-500/25 px-4 h-9 gap-1.5"
        >
          <Plus className="h-4 w-4" /> {actionLabel}
        </Button>
      )}
    </div>
  );
}
