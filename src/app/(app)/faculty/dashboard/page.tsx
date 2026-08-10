import type { Metadata } from "next";
import { FacultyDashboardContent } from "@/components/faculty/faculty-dashboard";

export const metadata: Metadata = { title: "Faculty Console Overview — CampusTracker" };

export default function FacultyDashboardPage() {
  return <FacultyDashboardContent />;
}
