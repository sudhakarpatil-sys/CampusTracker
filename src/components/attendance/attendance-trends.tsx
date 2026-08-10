"use client";

import * as React from "react";
import { format, startOfWeek, eachWeekOfInterval, subWeeks } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAttendance } from "@/hooks/use-attendance";
import { useSubjects } from "@/hooks/use-subjects";
import { cn } from "@/lib/utils";

/**
 * Attendance Trends — Line/area charts showing attendance % over time per subject.
 * Uses recharts (already in package.json) with the project's existing chart styling.
 */
export function AttendanceTrends() {
  const { records, statsBySubject } = useAttendance();
  const { subjects } = useSubjects();

  // Generate weekly attendance trend data per subject
  const weeklyData = React.useMemo(() => {
    if (records.length === 0) return [];

    const dates = records.map((r) => new Date(`${r.class_date}T00:00:00`));
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // Generate week buckets
    const weeks = eachWeekOfInterval(
      { start: minDate, end: maxDate },
      { weekStartsOn: 1 }
    ).slice(-12); // Last 12 weeks max

    return weeks.map((weekStart) => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const label = format(weekStart, "MMM d");

      const point: Record<string, number | string> = { week: label };

      subjects.forEach((s) => {
        const subjectRecords = records.filter(
          (r) =>
            r.subject_id === s.id &&
            new Date(`${r.class_date}T00:00:00`) >= weekStart &&
            new Date(`${r.class_date}T00:00:00`) < weekEnd &&
            r.status !== "cancelled"
        );

        if (subjectRecords.length > 0) {
          const present = subjectRecords.filter((r) => r.status === "present").length;
          point[s.name] = Math.round((present / subjectRecords.length) * 100);
        }
      });

      return point;
    });
  }, [records, subjects]);

  // Overall cumulative trend
  const cumulativeData = React.useMemo(() => {
    if (records.length === 0) return [];

    const sorted = [...records]
      .filter((r) => r.status !== "cancelled")
      .sort((a, b) => a.class_date.localeCompare(b.class_date));

    let present = 0;
    let total = 0;
    const points: { date: string; percentage: number }[] = [];
    let lastDate = "";

    sorted.forEach((r) => {
      total++;
      if (r.status === "present") present++;
      // Only add one point per date to avoid clutter
      if (r.class_date !== lastDate) {
        points.push({
          date: format(new Date(`${r.class_date}T00:00:00`), "MMM d"),
          percentage: Math.round((present / total) * 100),
        });
        lastDate = r.class_date;
      } else {
        // Update the last point
        points[points.length - 1] = {
          date: format(new Date(`${r.class_date}T00:00:00`), "MMM d"),
          percentage: Math.round((present / total) * 100),
        };
      }
    });

    return points.slice(-20); // Last 20 data points
  }, [records]);

  const chartTooltipStyle = {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: 12,
  };

  if (records.filter((r) => r.status !== "cancelled").length === 0) {
    return (
      <Card className="glass-shelf">
        <CardContent className="py-12">
          <p className="text-center text-sm text-muted-foreground">
            Mark some attendance to see trends over time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="overall" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overall">Overall Trend</TabsTrigger>
        <TabsTrigger value="subjects">By Subject</TabsTrigger>
      </TabsList>

      <TabsContent value="overall">
        <Card className="glass-shelf">
          <CardHeader>
            <CardTitle className="text-base">Cumulative Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={cumulativeData}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <ReferenceLine
                  y={75}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                  label={{
                    value: "75%",
                    position: "right",
                    fill: "hsl(var(--destructive))",
                    fontSize: 10,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#attendanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="subjects">
        <Card className="glass-shelf">
          <CardHeader>
            <CardTitle className="text-base">Weekly Attendance by Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <ReferenceLine
                  y={75}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                />
                {subjects.map((s) => (
                  <Line
                    key={s.id}
                    type="monotone"
                    dataKey={s.name}
                    stroke={s.color || "#5B7FFF"}
                    strokeWidth={2}
                    dot={{ r: 3, fill: s.color || "#5B7FFF" }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {subjects.map((s) => (
                <div key={s.id} className="flex items-center gap-1.5">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: s.color || "#5B7FFF" }}
                  />
                  <span className="text-[11px] text-muted-foreground">{s.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
