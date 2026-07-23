import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TimetableGrid } from "@/components/timetable/timetable-grid";

export const metadata: Metadata = { title: "Timetable" };

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Timetable" description="Build your weekly schedule once — attendance and dashboards do the rest." />
      <TimetableGrid />
    </div>
  );
}
