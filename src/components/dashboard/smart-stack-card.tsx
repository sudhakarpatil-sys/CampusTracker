"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CalendarCheck2,
  GraduationCap,
  TrendingDown,
  Clock,
  BookOpen,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAttendance } from "@/hooks/use-attendance";
import { useExams } from "@/hooks/use-exams";
import { useSubjects } from "@/hooks/use-subjects";
import { daysUntil } from "@/lib/academic";
import { cn } from "@/lib/utils";

type SmartCardType = "low-attendance" | "exam-tomorrow" | "exam-today" | "streak";

interface SmartCard {
  id: string;
  type: SmartCardType;
  priority: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  accent: string;
}

/**
 * Smart Stack Card — Event-driven priority card that renders contextual alerts
 * above the dashboard widget grid. Shows the highest-priority academic alert
 * based on real-time academic data (attendance danger, upcoming exams, etc.).
 */
export function SmartStackCard() {
  const { statsBySubject, overallStats } = useAttendance();
  const { exams } = useExams();
  const { subjects } = useSubjects();
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());

  const subjectMap = React.useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  const cards: SmartCard[] = React.useMemo(() => {
    const result: SmartCard[] = [];

    // Low attendance alerts (< 75%)
    statsBySubject.forEach((stats, subjectId) => {
      if (stats.percentage < 75 && stats.total > 0) {
        const subject = subjectMap.get(subjectId);
        result.push({
          id: `low-att-${subjectId}`,
          type: "low-attendance",
          priority: stats.percentage < 65 ? 100 : 80,
          title: `${subject?.name ?? "Subject"} attendance is ${stats.percentage}%`,
          subtitle: `${stats.absent} absences — attend ${Math.ceil(
            (0.75 * (stats.present + stats.absent) - stats.present) / (1 - 0.75)
          )} more classes to reach 75%`,
          icon: TrendingDown,
          gradient: "from-rose-500/20 via-rose-500/10 to-transparent",
          accent: "text-rose-500",
        });
      }
    });

    // Exam alerts
    exams.forEach((exam) => {
      const days = daysUntil(exam.exam_date);
      const subject = exam.subject_id ? subjectMap.get(exam.subject_id) : null;

      if (days === 0) {
        result.push({
          id: `exam-today-${exam.id}`,
          type: "exam-today",
          priority: 120,
          title: `${subject?.name ?? "Exam"} is TODAY`,
          subtitle: exam.venue ? `Venue: ${exam.venue}` : "Good luck!",
          icon: AlertTriangle,
          gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
          accent: "text-amber-500",
        });
      } else if (days === 1) {
        result.push({
          id: `exam-tmrw-${exam.id}`,
          type: "exam-tomorrow",
          priority: 110,
          title: `${subject?.name ?? "Exam"} is TOMORROW`,
          subtitle: exam.venue ? `Venue: ${exam.venue}` : "Prepare well!",
          icon: GraduationCap,
          gradient: "from-amber-500/15 via-amber-400/10 to-transparent",
          accent: "text-amber-500",
        });
      }
    });

    // Attendance streak
    if (overallStats.percentage >= 90 && overallStats.total >= 10) {
      result.push({
        id: "streak-high",
        type: "streak",
        priority: 30,
        title: "Great attendance streak! 🔥",
        subtitle: `${overallStats.percentage}% overall — keep it up!`,
        icon: CalendarCheck2,
        gradient: "from-emerald-500/15 via-emerald-400/10 to-transparent",
        accent: "text-emerald-500",
      });
    }

    return result
      .filter((c) => !dismissed.has(c.id))
      .sort((a, b) => b.priority - a.priority);
  }, [statsBySubject, exams, overallStats, dismissed, subjectMap]);

  const topCard = cards[0];

  if (!topCard) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={topCard.id}
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Card
          className={cn(
            "relative overflow-hidden border-0 bg-gradient-to-r",
            topCard.gradient,
            "backdrop-blur-sm"
          )}
        >
          {/* Subtle pulse dot */}
          <div className="absolute right-4 top-4">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                  topCard.accent.replace("text-", "bg-")
                )}
              />
              <span
                className={cn(
                  "relative inline-flex h-2.5 w-2.5 rounded-full",
                  topCard.accent.replace("text-", "bg-")
                )}
              />
            </span>
          </div>

          <div className="flex items-center gap-3 p-4">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/80",
                topCard.accent
              )}
            >
              <topCard.icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {topCard.title}
              </p>
              <p className="text-xs text-muted-foreground">{topCard.subtitle}</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() =>
                setDismissed((prev) => new Set([...prev, topCard.id]))
              }
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>

          {cards.length > 1 && (
            <div className="flex items-center justify-center gap-1 pb-2">
              {cards.slice(0, 4).map((c, i) => (
                <div
                  key={c.id}
                  className={cn(
                    "h-1 rounded-full transition-all",
                    i === 0 ? "w-4 bg-foreground/40" : "w-1.5 bg-foreground/15"
                  )}
                />
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
