"use client";

import * as React from "react";
import { format, startOfWeek, startOfMonth } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AttendanceRecord, Subject } from "@/types/database.types";

const COLORS = { present: "#3DD68C", absent: "#E5484D", cancelled: "#8B92A6" };

function groupByPeriod(records: AttendanceRecord[], getKey: (date: Date) => string) {
  const buckets = new Map<string, { present: number; absent: number }>();
  records
    .filter((r) => r.status !== "cancelled")
    .forEach((r) => {
      const key = getKey(new Date(`${r.class_date}T00:00:00`));
      const bucket = buckets.get(key) ?? { present: 0, absent: 0 };
      if (r.status === "present") bucket.present += 1;
      else bucket.absent += 1;
      buckets.set(key, bucket);
    });

  return Array.from(buckets.entries())
    .map(([label, counts]) => ({
      label,
      percentage: Math.round((counts.present / (counts.present + counts.absent)) * 100),
    }))
    .slice(-8);
}

export function AttendanceCharts({ records, subjects, statsBySubject }: {
  records: AttendanceRecord[];
  subjects: Subject[];
  statsBySubject: Map<string, { percentage: number; present: number; absent: number; cancelled: number }>;
}) {
  const overallCounts = React.useMemo(() => {
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const cancelled = records.filter((r) => r.status === "cancelled").length;
    return [
      { name: "Present", value: present, color: COLORS.present },
      { name: "Absent", value: absent, color: COLORS.absent },
      { name: "Cancelled", value: cancelled, color: COLORS.cancelled },
    ].filter((d) => d.value > 0);
  }, [records]);

  const weekly = React.useMemo(
    () => groupByPeriod(records, (d) => format(startOfWeek(d, { weekStartsOn: 1 }), "MMM d")),
    [records]
  );
  const monthly = React.useMemo(() => groupByPeriod(records, (d) => format(startOfMonth(d), "MMM yyyy")), [records]);

  const subjectComparison = subjects.map((s) => ({
    name: s.code || s.name,
    percentage: statsBySubject.get(s.id)?.percentage ?? 0,
    color: s.color,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Overall distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {overallCounts.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Mark some attendance to see this chart.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={overallCounts} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2}>
                  {overallCounts.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subject comparison</CardTitle>
        </CardHeader>
        <CardContent>
          {subjectComparison.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Add subjects to compare attendance.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={subjectComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                  {subjectComparison.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly">
              <TrendChart data={weekly} />
            </TabsContent>
            <TabsContent value="monthly">
              <TrendChart data={monthly} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function TrendChart({ data }: { data: { label: string; percentage: number }[] }) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Not enough data yet.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
