"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export function MobileModal({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = "max-h-[85vh]",
}: MobileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop Click Dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up Bottom Sheet Drawer */}
      <div className={`relative w-full bg-[#141923] border-t border-purple-500/40 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in slide-in-from-bottom duration-300 ${maxHeight}`}>
        
        {/* Top Drag Pill Handle */}
        <div className="flex flex-col items-center pt-3 pb-2 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 rounded-full bg-slate-700/80 hover:bg-purple-400 transition-colors" />
        </div>

        {/* Modal Header */}
        {title && (
          <div className="px-5 py-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-base text-white tracking-tight">{title}</h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-purple-500/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
}
