"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, ShieldCheck, Target, TrendingDown } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { useAttendance } from "@/hooks/use-attendance";
import { useSubjects } from "@/hooks/use-subjects";
import { cn } from "@/lib/utils";

/**
 * Academic Insights Widget — AI-powered placeholder showing:
 * - Safe leave summary (uses existing predictAttendance logic)
 * - Weak subject detection preview
 * - SGPA target placeholder
 *
 * This is a UI preview only. Full AI logic comes in Phase 5.
 */
export function AcademicInsightsWidget(props: {
  onHide?: () => void;
  draggableProps?: React.HTMLAttributes<HTMLButtonElement>;
}) {
  const { statsBySubject, predictionFor } = useAttendance();
  const { subjects } = useSubjects();

  // Find subjects where you can still skip classes
  const safeLeaveSubjects = subjects
    .map((s) => ({
      subject: s,
      prediction: predictionFor(s.id, s.attendance_target),
    }))
    .filter((s) => !s.prediction.isBelowTarget && s.prediction.canSkip > 0);

  // Find subjects below target
  const weakSubjects = subjects.filter(
    (s) => (statsBySubject.get(s.id)?.percentage ?? 100) < s.attendance_target
  );

  const totalSafeLeaves = safeLeaveSubjects.reduce((acc, s) => acc + s.prediction.canSkip, 0);

  const insights = [
    {
      icon: ShieldCheck,
      label: "Safe Leaves Available",
      value: totalSafeLeaves > 0 ? `${totalSafeLeaves}` : "0",
      description:
        totalSafeLeaves > 0
          ? `Across ${safeLeaveSubjects.length} subject${safeLeaveSubjects.length > 1 ? "s" : ""}`
          : "All subjects at threshold",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: TrendingDown,
      label: "Attention Needed",
      value: weakSubjects.length > 0 ? `${weakSubjects.length}` : "0",
      description:
        weakSubjects.length > 0
          ? weakSubjects
              .slice(0, 2)
              .map((s) => s.name)
              .join(", ")
          : "All subjects on track",
      color:
        weakSubjects.length > 0
          ? "text-rose-600 dark:text-rose-400"
          : "text-emerald-600 dark:text-emerald-400",
      bg: weakSubjects.length > 0 ? "bg-rose-500/10" : "bg-emerald-500/10",
    },
    {
      icon: Target,
      label: "SGPA Target",
      value: "—",
      description: "AI prediction coming soon",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <WidgetShell title="Academic Insights" icon={Sparkles} {...props}>
      <div className="space-y-2.5">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-2.5 transition-all hover:border-border/80"
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  insight.bg
                )}
              >
                <Icon className={cn("h-4 w-4", insight.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {insight.label}
                  </p>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {insight.value}
                  </span>
                </div>
                <p className="truncate text-[10px] text-muted-foreground/70">
                  {insight.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-indigo-500/30 bg-indigo-500/5 py-2">
        <Brain className="h-3.5 w-3.5 text-indigo-500" />
        <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
          AI Engine — Phase 5
        </span>
      </div>
    </WidgetShell>
  );
}
