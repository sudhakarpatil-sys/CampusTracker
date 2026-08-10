"use client";

import * as React from "react";
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  ChevronRight, 
  GraduationCap,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SmartStackItem {
  id: string;
  type: "class" | "attendance" | "assignment" | "note" | "announcement" | "exam";
  title: string;
  subtitle: string;
  timestamp?: string;
  badge?: string;
  badgeType?: "purple" | "emerald" | "amber" | "rose" | "sapphire";
  actionLabel?: string;
  onAction?: () => void;
  metadata?: Record<string, any>;
}

interface SmartStackProps {
  items: SmartStackItem[];
  className?: string;
}

export function SmartStack({ items, className = "" }: SmartStackProps) {
  const [activeIdx, setActiveIdx] = React.useState(0);

  if (!items || items.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#181F2E] to-[#141923] border border-slate-800/80 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1 rounded-lg bg-purple-500/15 text-purple-400">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Smart Stack™</span>
        </div>
        <p className="text-sm text-slate-300 font-medium">All academic updates are up to date.</p>
        <p className="text-xs text-slate-500 mt-1">Check back later for schedule alerts and notices.</p>
      </div>
    );
  }

  const currentItem = items[activeIdx % items.length] || items[0];
  if (!currentItem) return null;

  const getBadgeStyle = (type?: SmartStackItem["badgeType"]) => {
    switch (type) {
      case "emerald":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
      case "amber":
        return "bg-amber-500/15 text-amber-400 border-amber-500/20";
      case "rose":
        return "bg-rose-500/15 text-rose-400 border-rose-500/20";
      case "sapphire":
        return "bg-blue-500/15 text-blue-400 border-blue-500/20";
      default:
        return "bg-purple-500/15 text-purple-300 border-purple-500/20";
    }
  };

  const getTypeIcon = (type: SmartStackItem["type"]) => {
    switch (type) {
      case "class":
        return <Clock className="h-4 w-4 text-purple-400" />;
      case "attendance":
        return <ShieldCheck className="h-4 w-4 text-emerald-400" />;
      case "assignment":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "note":
        return <FileText className="h-4 w-4 text-blue-400" />;
      case "exam":
        return <GraduationCap className="h-4 w-4 text-rose-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Outer Glow Tint */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-purple-600/30 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />

      {/* Card Content */}
      <div className="relative bg-gradient-to-br from-[#1A2030] via-[#141923] to-[#121620] border border-purple-500/20 rounded-2xl p-4 shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
              {getTypeIcon(currentItem.type)}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                Smart Stack™
              </span>
              <span className="h-1 w-1 rounded-full bg-purple-400" />
              <span className="text-[11px] text-slate-400 font-medium">
                {activeIdx + 1} of {items.length}
              </span>
            </div>
          </div>

          {currentItem.badge && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getBadgeStyle(currentItem.badgeType)}`}>
              {currentItem.badge}
            </span>
          )}
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-1 my-2">
          <h3 className="font-bold text-base tracking-tight text-white line-clamp-1">
            {currentItem.title}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {currentItem.subtitle}
          </p>
        </div>

        {/* Card Footer Action */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-medium">
            {currentItem.timestamp || "Updated just now"}
          </span>

          <div className="flex items-center gap-2">
            {items.length > 1 && (
              <div className="flex gap-1 mr-1">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIdx % items.length ? "w-4 bg-purple-400" : "w-1.5 bg-slate-700 hover:bg-slate-500"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {currentItem.onAction && (
              <Button
                variant="ghost"
                size="sm"
                onClick={currentItem.onAction}
                className="h-7 px-2.5 rounded-lg text-xs font-semibold bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 hover:text-white transition-all flex items-center gap-1"
              >
                {currentItem.actionLabel || "View"} <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
