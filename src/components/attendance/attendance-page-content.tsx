"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodaysSchedule } from "@/components/attendance/todays-schedule";
import { SubjectAttendanceList } from "@/components/attendance/subject-attendance-list";
import { AttendanceCharts } from "@/components/attendance/attendance-charts";
import { useAttendance } from "@/hooks/use-attendance";
import { useSubjects } from "@/hooks/use-subjects";

export function AttendancePageContent() {
  const { records, statsBySubject } = useAttendance();
  const { subjects } = useSubjects();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today&apos;s schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <TodaysSchedule />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">Attendance analytics</h2>
        <SubjectAttendanceList />
      </div>

      <AttendanceCharts records={records} subjects={subjects} statsBySubject={statsBySubject} />
    </div>
  );
}
