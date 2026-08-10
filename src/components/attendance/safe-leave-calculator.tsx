"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Calculator, Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAttendance } from "@/hooks/use-attendance";
import { useSubjects } from "@/hooks/use-subjects";
import { cn } from "@/lib/utils";

const TARGET_OPTIONS = [60, 65, 70, 75, 80, 85, 90];

/**
 * Safe Leave Calculator — Interactive calculator using predictAttendance()
 * to show how many classes a student can skip or must attend per subject.
 */
export function SafeLeaveCalculator() {
  const { predictionFor, statsBySubject } = useAttendance();
  const { subjects } = useSubjects();
  const [target, setTarget] = React.useState(75);

  const predictions = React.useMemo(() => {
    return subjects.map((s) => {
      const stats = statsBySubject.get(s.id);
      const prediction = predictionFor(s.id, target);
      return {
        subject: s,
        stats,
        prediction,
      };
    });
  }, [subjects, statsBySubject, predictionFor, target]);

  return (
    <div className="space-y-4">
      {/* Target selector */}
      <Card className="glass-shelf">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="h-4 w-4 text-indigo-500" />
            Safe Leave Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Select your target attendance percentage to see how many classes you can safely skip.
            </p>
            <div className="flex flex-wrap gap-2">
              {TARGET_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                    target === t
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-border/80 hover:bg-muted/50"
                  )}
                >
                  {t}%
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prediction cards */}
      {subjects.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Add subjects to calculate safe leaves.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {predictions.map((p, idx) => {
            const { prediction, subject, stats } = p;
            const currentPct = stats?.percentage ?? 100;

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.25) }}
              >
                <Card className="glass-shelf h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {subject.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {subject.code || "—"} · {currentPct}% current
                        </p>
                      </div>
                      <div
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: subject.color || "#5B7FFF" }}
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      {prediction.isBelowTarget ? (
                        <>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
                            <TrendingUp className="h-4 w-4 text-rose-500" />
                          </div>
                          <div>
                            <p className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                              {prediction.needToAttend}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              classes needed to reach {target}%
                            </p>
                          </div>
                        </>
                      ) : prediction.canSkip > 0 ? (
                        <>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                            <TrendingDown className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                              {prediction.canSkip}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              classes you can safely skip
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                            <Minus className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                              At the boundary
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              No room to skip — attend all classes
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Attendance bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                        <span>{stats?.present ?? 0}P / {stats?.absent ?? 0}A</span>
                        <span>Target: {target}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            currentPct >= target
                              ? "bg-emerald-500"
                              : currentPct >= target - 5
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          )}
                          style={{ width: `${Math.min(currentPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
