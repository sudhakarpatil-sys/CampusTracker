"use client";

import * as React from "react";
import { BookOpen, FileText, Paperclip, ChevronRight } from "lucide-react";
import type { Note } from "@/types/database.types";

interface NoteCardProps {
  note: Note;
  subjectName?: string;
  onSelect?: (note: Note) => void;
  className?: string;
}

export function NoteCard({
  note,
  subjectName,
  onSelect,
  className = "",
}: NoteCardProps) {
  const attachmentCount = Array.isArray(note.attachments) ? note.attachments.length : 0;

  return (
    <div
      onClick={() => onSelect?.(note)}
      className={`bg-gradient-to-br from-[#181F2E] to-[#141923] border border-slate-800/80 rounded-2xl p-4 shadow-lg transition-all hover:border-purple-500/40 cursor-pointer overflow-hidden ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-400 shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white tracking-tight line-clamp-1">
              {note.title || "Untitled Note"}
            </h4>
            {subjectName && (
              <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/20">
                {subjectName}
              </span>
            )}
          </div>
        </div>

        {attachmentCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
            <Paperclip className="h-3 w-3 text-purple-400" /> {attachmentCount}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400 line-clamp-2 mt-2.5 leading-relaxed">
        {note.content || "No preview text available..."}
      </p>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] text-slate-500">
        <span>Updated: {new Date(note.updated_at).toLocaleDateString()}</span>
        <span className="text-purple-400 font-semibold flex items-center gap-0.5">
          Read Note <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}
