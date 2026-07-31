"use client";

import { motion } from "framer-motion";
import { GraduationCap, CheckCircle2, Calendar, Award } from "lucide-react";
import { useAttendance } from "@/hooks/use-attendance";
import { useAssignments } from "@/hooks/use-assignments";
import { useEvents } from "@/hooks/use-events";
import { useSubjects } from "@/hooks/use-subjects";
import { cn } from "@/lib/utils";

export function DashboardMetrics() {
  const { overallStats } = useAttendance();
  const { assignments } = useAssignments();
  const { events } = useEvents();
  const { subjects } = useSubjects();

  const pendingCount = assignments.filter((a) => a.status !== "completed").length;

  const metrics = [
    {
      title: "Overall Attendance",
      value: `${overallStats.percentage}%`,
      subtitle: `${overallStats.present} Present / ${overallStats.absent} Absent`,
      icon: Award,
      badge: overallStats.percentage >= 75 ? "Target Met" : "Attention Needed",
      badgeVariant: overallStats.percentage >= 75 ? "success" : "destructive",
      accentBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      borderColor: "hover:border-indigo-500/40",
    },
    {
      title: "Pending Assignments",
      value: pendingCount.toString(),
      subtitle: pendingCount === 0 ? "All caught up!" : `${pendingCount} item(s) due soon`,
      icon: CheckCircle2,
      badge: pendingCount === 0 ? "Clear" : "Active Tasks",
      badgeVariant: pendingCount === 0 ? "success" : "warning",
      accentBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      borderColor: "hover:border-rose-500/40",
    },
    {
      title: "Upcoming Events",
      value: events.length.toString(),
      subtitle: events.length === 0 ? "No upcoming events" : "Scheduled on calendar",
      icon: Calendar,
      badge: "Calendar",
      badgeVariant: "info",
      accentBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      borderColor: "hover:border-amber-500/40",
    },
    {
      title: "Active Subjects",
      value: subjects.length.toString(),
      subtitle: `${subjects.length} course(s) enrolled`,
      icon: GraduationCap,
      badge: "Enrolled",
      badgeVariant: "default",
      accentBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      borderColor: "hover:border-emerald-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border/80 bg-card p-4 text-card-foreground shadow-sm transition-all duration-200",
              m.borderColor
            )}
          >
            <div className="flex items-center justify-between">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110", m.accentBg)}>
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-tight",
                  m.badgeVariant === "success" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                  m.badgeVariant === "warning" && "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                  m.badgeVariant === "destructive" && "bg-rose-500/15 text-rose-600 dark:text-rose-400",
                  m.badgeVariant === "info" && "bg-sky-500/15 text-sky-600 dark:text-sky-400",
                  m.badgeVariant === "default" && "bg-muted text-muted-foreground"
                )}
              >
                {m.badge}
              </span>
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">{m.title}</p>
              <p className="font-mono text-2xl font-bold tracking-tight text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground/80">{m.subtitle}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
