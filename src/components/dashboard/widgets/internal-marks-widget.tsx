"use client";

import { motion } from "framer-motion";
import { BookMarked, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { useSubjects } from "@/hooks/use-subjects";
import { cn } from "@/lib/utils";

/**
 * Internal Marks Widget — shows a placeholder preview of internal assessment
 * marks per subject. Actual marks data will come from the Academic Connector
 * Framework once the InternalMarksAdapter is connected. For now, renders
 * an elegant "awaiting sync" state.
 */
export function InternalMarksWidget(props: {
  onHide?: () => void;
  draggableProps?: React.HTMLAttributes<HTMLButtonElement>;
}) {
  const { subjects } = useSubjects();

  const displaySubjects = subjects.slice(0, 4);

  return (
    <WidgetShell title="Internal Marks" icon={BookMarked} {...props}>
      {displaySubjects.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">
          No subjects enrolled yet.
        </p>
      ) : (
        <div className="space-y-2.5">
          {displaySubjects.map((subject, idx) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 transition-all hover:border-border/80"
            >
              <div
                className="h-8 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: subject.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {subject.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {subject.code ?? "No code"}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Minus className="h-3 w-3" />
                <span className="font-mono text-xs text-muted-foreground/60">
                  —/—
                </span>
              </div>
            </motion.div>
          ))}
          <p className="pt-1 text-center text-[10px] text-muted-foreground/60">
            Marks sync via Academic Connector
          </p>
        </div>
      )}
    </WidgetShell>
  );
}
