"use client";

import { Check } from "lucide-react";
import { SUBJECT_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUBJECT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60"
          style={{ backgroundColor: color }}
          aria-label={`Choose color ${color}`}
        >
          {value === color && <Check className="h-4 w-4 text-white drop-shadow" />}
        </button>
      ))}
    </div>
  );
}
