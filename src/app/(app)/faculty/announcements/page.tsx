import type { Metadata } from "next";
import { FacultyAnnouncementsManagerContent } from "@/components/faculty/faculty-announcements-manager";

export const metadata: Metadata = { title: "Course Announcements — CampusTracker Faculty" };

export default function FacultyAnnouncementsPage() {
  return <FacultyAnnouncementsManagerContent />;
}
