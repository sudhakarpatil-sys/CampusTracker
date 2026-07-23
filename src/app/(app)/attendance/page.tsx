import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AttendancePageContent } from "@/components/attendance/attendance-page-content";

export const metadata: Metadata = { title: "Attendance" };

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Mark today's classes in one click. Everything else updates automatically." />
      <AttendancePageContent />
    </div>
  );
}
