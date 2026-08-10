"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodaysSchedule } from "@/components/attendance/todays-schedule";
import { SubjectAttendanceList } from "@/components/attendance/subject-attendance-list";
import { AttendanceCharts } from "@/components/attendance/attendance-charts";
import { SafeLeaveCalculator } from "@/components/attendance/safe-leave-calculator";
import { AttendanceHistory } from "@/components/attendance/attendance-history";
import { AttendanceTrends } from "@/components/attendance/attendance-trends";
import { useAttendance } from "@/hooks/use-attendance";
import { useSubjects } from "@/hooks/use-subjects";

export function AttendancePageContent() {
  const { records, statsBySubject } = useAttendance();
  const { subjects } = useSubjects();

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="bg-muted/50">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="subjects">Subject-wise</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="safe-leave">Safe Leave</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today&apos;s schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <TodaysSchedule />
          </CardContent>
        </Card>

        <AttendanceCharts records={records} subjects={subjects} statsBySubject={statsBySubject} />
      </TabsContent>

      <TabsContent value="subjects">
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold">Attendance analytics</h2>
          <SubjectAttendanceList />
        </div>
      </TabsContent>

      <TabsContent value="history">
        <AttendanceHistory />
      </TabsContent>

      <TabsContent value="safe-leave">
        <SafeLeaveCalculator />
      </TabsContent>

      <TabsContent value="trends">
        <AttendanceTrends />
      </TabsContent>
    </Tabs>
  );
}
