"use client";

import * as React from "react";
import { Clock, MapPin, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ClassItem {
  id: string;
  subjectName: string;
  subjectCode?: string | null;
  facultyName?: string | null;
  classroom?: string | null;
  startTime: string;
  endTime: string;
  status: "ongoing" | "upcoming" | "completed" | "cancelled";
  color?: string;
}

interface ClassTimelineCardProps {
  item: ClassItem;
  onSelect?: (item: ClassItem) => void;
  className?: string;
}

export function ClassTimelineCard({
  item,
  onSelect,
  className = "",
}: ClassTimelineCardProps) {
  const getStatusBadge = () => {
    switch (item.status) {
      case "ongoing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            Ongoing
          </span>
        );
      case "upcoming":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
            Upcoming
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700/60">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/20">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onSelect?.(item)}
      className={`relative bg-gradient-to-br from-[#181F2E] to-[#141923] border border-slate-800/80 rounded-2xl p-4 shadow-lg transition-all hover:border-purple-500/40 cursor-pointer overflow-hidden ${className}`}
    >
      {/* Subject Color Left Accent Line */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-1.5 bg-purple-500" 
        style={{ backgroundColor: item.color || "#8B5CF6" }}
      />

      <div className="pl-2.5 space-y-2">
        {/* Header Row: Time & Status Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-purple-300 font-semibold">
            <Clock className="h-3.5 w-3.5 text-purple-400" />
            <span>{item.startTime} - {item.endTime}</span>
          </div>

          {getStatusBadge()}
        </div>

        {/* Title & Subject Code */}
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-white tracking-tight line-clamp-1">
              {item.subjectName}
            </h4>
            {item.subjectCode && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                {item.subjectCode}
              </span>
            )}
          </div>

          {/* Details Row: Faculty & Room */}
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
            {item.facultyName && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span className="line-clamp-1">{item.facultyName}</span>
              </span>
            )}

            {item.classroom && (
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-purple-400" />
                <span>{item.classroom}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
