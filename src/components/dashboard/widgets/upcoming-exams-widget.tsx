"use client";

import { motion } from "framer-motion";
import { GraduationCap, Clock, MapPin, User } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { useExams } from "@/hooks/use-exams";
import { useSubjects } from "@/hooks/use-subjects";
import { daysUntil } from "@/lib/academic";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function UpcomingExamsWidget(props: {
  onHide?: () => void;
  draggableProps?: React.HTMLAttributes<HTMLButtonElement>;
}) {
  const { exams } = useExams();
  const { subjects } = useSubjects();

  const upcoming = exams
    .filter((e) => daysUntil(e.exam_date) >= 0)
    .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
    .slice(0, 3);

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  return (
    <WidgetShell title="Upcoming Exams" icon={GraduationCap} {...props}>
      {upcoming.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">
          No upcoming exams scheduled.
        </p>
      ) : (
        <div className="space-y-3">
          {upcoming.map((exam, idx) => {
            const subject = exam.subject_id ? subjectMap.get(exam.subject_id) : null;
            const days = daysUntil(exam.exam_date);
            const isUrgent = days <= 3;

            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className={cn(
                  "rounded-lg border p-3 transition-all duration-200",
                  isUrgent
                    ? "border-rose-500/30 bg-rose-500/5"
                    : "border-border/60 bg-muted/30 hover:border-border"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {subject?.name ?? "Exam"}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(exam.exam_date + "T00:00:00").toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {exam.exam_time && ` at ${exam.exam_time}`}
                      </span>
                      {exam.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {exam.venue}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={isUrgent ? "destructive" : "secondary"}
                    className="shrink-0 px-2 py-0.5 text-[10px] font-mono"
                  >
                    {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d`}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </WidgetShell>
  );
}
