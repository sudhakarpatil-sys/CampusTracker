import type { Metadata } from "next";
import { FacultySubjectsViewContent } from "@/components/faculty/faculty-subjects-view";

export const metadata: Metadata = { title: "My Subjects — CampusTracker Faculty" };

export default function FacultySubjectsPage() {
  return <FacultySubjectsViewContent />;
}
