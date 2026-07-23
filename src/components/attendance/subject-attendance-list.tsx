"use client";

import { AlertTriangle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useSubjects } from "@/hooks/use-subjects";
import { useAttendance } from "@/hooks/use-attendance";

export function SubjectAttendanceList() {
  const { subjects } = useSubjects();
  const { statsBySubject, predictionFor } = useAttendance();

  if (subjects.length === 0) {
    return <EmptyState icon={TrendingUp} title="No subjects yet" description="Add subjects to see attendance analytics per subject." />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {subjects.map((subject) => {
        const stats = statsBySubject.get(subject.id) ?? { total: 0, present: 0, absent: 0, cancelled: 0, percentage: 100 };
        const prediction = predictionFor(subject.id, subject.attendance_target);
        return (
          <Card key={subject.id} className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium" style={{ color: subject.color }}>
                {subject.name}
              </p>
              {prediction.isBelowTarget && (
                <Badge variant="destructive" className="gap-1 text-[10px]">
                  <AlertTriangle className="h-3 w-3" /> Below {subject.attendance_target}%
                </Badge>
              )}
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold">{stats.percentage}%</span>
              <span className="text-xs text-muted-foreground">
                {stats.present}P / {stats.absent}A / {stats.cancelled}C
              </span>
            </div>
            <Progress value={stats.percentage} className="mt-2 h-1.5" />

            <p className="mt-2 text-xs text-muted-foreground">
              {prediction.isBelowTarget
                ? `Attend the next ${prediction.needToAttend} class${prediction.needToAttend === 1 ? "" : "es"} in a row to reach ${subject.attendance_target}%.`
                : `You can skip ${prediction.canSkip} more class${prediction.canSkip === 1 ? "" : "es"} and stay at or above ${subject.attendance_target}%.`}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
