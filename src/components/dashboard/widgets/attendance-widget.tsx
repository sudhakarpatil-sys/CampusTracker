"use client";

import { AlertTriangle, CalendarCheck2 } from "lucide-react";
import { WidgetShell } from "@/components/dashboard/widget-shell";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAttendance } from "@/hooks/use-attendance";
import { useSubjects } from "@/hooks/use-subjects";

export function AttendanceWidget(props: { onHide?: () => void; draggableProps?: React.HTMLAttributes<HTMLButtonElement> }) {
  const { overallStats, statsBySubject } = useAttendance();
  const { subjects } = useSubjects();

  const belowTarget = subjects.filter((s) => (statsBySubject.get(s.id)?.percentage ?? 100) < s.attendance_target);

  return (
    <WidgetShell title="Overall attendance" icon={CalendarCheck2} {...props}>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold">{overallStats.percentage}%</span>
        <span className="text-xs text-muted-foreground">
          {overallStats.present}P / {overallStats.absent}A / {overallStats.cancelled}C
        </span>
      </div>
      <Progress value={overallStats.percentage} className="h-1.5" />

      {belowTarget.length > 0 ? (
        <div className="mt-3 space-y-1.5">
          {belowTarget.slice(0, 3).map((s) => (
            <Badge key={s.id} variant="destructive" className="mr-1.5 gap-1 text-[10px]">
              <AlertTriangle className="h-3 w-3" /> {s.name} below {s.attendance_target}%
            </Badge>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">All subjects are meeting their attendance target.</p>
      )}
    </WidgetShell>
  );
}
