import type { Metadata } from "next";
import { FacultyAssignmentsManagerContent } from "@/components/faculty/faculty-assignments-manager";

export const metadata: Metadata = { title: "Course Assignments — CampusTracker Faculty" };

export default function FacultyAssignmentsPage() {
  return <FacultyAssignmentsManagerContent />;
}
