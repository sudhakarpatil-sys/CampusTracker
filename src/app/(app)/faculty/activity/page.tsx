import type { Metadata } from "next";
import { FacultyActivityTimelineContent } from "@/components/faculty/faculty-activity-timeline";

export const metadata: Metadata = { title: "Faculty Publishing Activity — CampusTracker" };

export default function FacultyActivityPage() {
  return <FacultyActivityTimelineContent />;
}
