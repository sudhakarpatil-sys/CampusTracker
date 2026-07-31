"use client";

import { GripVertical, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface WidgetShellProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  onHide?: () => void;
  draggableProps?: React.HTMLAttributes<HTMLButtonElement>;
  className?: string;
}

/** Shared frame for every dashboard widget: margin-tab header, drag handle,
 * and a hide control — matches the "notebook tab" signature from the
 * landing page so the dashboard feels like a continuation of the brand. */
export function WidgetShell({ title, icon: Icon, children, onHide, draggableProps, className }: WidgetShellProps) {
  return (
    <Card className={cn("group relative flex h-full flex-col overflow-hidden glass-shelf", className)}>
      <div className="margin-tab flex items-center justify-between px-4 pt-4 pb-1">
        <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-foreground">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/60 text-accent">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span className="font-display tracking-tight font-semibold text-sm capitalize">{title}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {onHide && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={onHide} aria-label={`Hide ${title}`}>
              <EyeOff className="h-3.5 w-3.5" />
            </Button>
          )}
          <button
            className="flex h-7 w-7 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing"
            aria-label={`Reorder ${title}`}
            {...draggableProps}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 pt-2">{children}</div>
    </Card>
  );
}
