"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CalendarCheck2, CheckCircle, XCircle, Slash } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { Badge } from "@/components/ui/badge";
import { useAttendance } from "@/hooks/use-attendance";
import { useSubjects } from "@/hooks/use-subjects";

export function AttendanceWidget(props: { onHide?: () => void; draggableProps?: React.HTMLAttributes<HTMLButtonElement> }) {
  const { overallStats, statsBySubject } = useAttendance();
  const { subjects } = useSubjects();

  const belowTarget = subjects.filter((s) => (statsBySubject.get(s.id)?.percentage ?? 100) < s.attendance_target);
  const percentage = overallStats.percentage;
  const radius = 36;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <WidgetShell title="Overall attendance" icon={CalendarCheck2} {...props}>
      <div className="flex items-center gap-5 py-2">
        {/* Animated Donut SVG Ring */}
        <div className="relative flex shrink-0 items-center justify-center">
          <svg className="h-24 w-24 -rotate-90 transform">
            {/* Background Track */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/40"
              fill="transparent"
            />
            {/* Progress Stroke */}
            <motion.circle
              cx="48"
              cy="48"
              r={radius}
              stroke="url(#attendanceGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
              fill="transparent"
            />
            <defs>
              <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-xl font-bold tracking-tight text-foreground">{percentage}%</span>
          </div>
        </div>

        {/* Stats Breakdown */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-3.5 w-3.5" /> Present
            </span>
            <span className="font-mono font-semibold text-foreground">{overallStats.present}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
              <XCircle className="h-3.5 w-3.5" /> Absent
            </span>
            <span className="font-mono font-semibold text-foreground">{overallStats.absent}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
              <Slash className="h-3.5 w-3.5" /> Cancelled
            </span>
            <span className="font-mono font-semibold text-foreground">{overallStats.cancelled}</span>
          </div>
        </div>
      </div>

      {belowTarget.length > 0 ? (
        <div className="mt-3 space-y-1.5 border-t border-border/50 pt-3">
          {belowTarget.slice(0, 2).map((s) => (
            <Badge key={s.id} variant="destructive" className="flex items-center gap-1.5 text-[10px] font-normal">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <span className="truncate">{s.name} below {s.attendance_target}% target</span>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-muted-foreground">✨ All subjects are meeting target attendance.</p>
      )}
    </WidgetShell>
  );
}
