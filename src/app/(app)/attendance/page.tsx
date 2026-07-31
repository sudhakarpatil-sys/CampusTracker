import type { Metadata } from "next";
import { AttendanceHero } from "@/components/attendance/attendance-hero";
import { AttendancePageContent } from "@/components/attendance/attendance-page-content";

export const metadata: Metadata = { title: "Attendance — CampusTracker" };

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <AttendanceHero />
      <AttendancePageContent />
    </div>
  );
}
