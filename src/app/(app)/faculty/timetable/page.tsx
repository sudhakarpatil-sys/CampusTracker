import type { Metadata } from "next";
import { FacultyTimetableViewContent } from "@/components/faculty/faculty-timetable-view";

export const metadata: Metadata = { title: "Teaching Timetable — CampusTracker Faculty" };

export default function FacultyTimetablePage() {
  return <FacultyTimetableViewContent />;
}
