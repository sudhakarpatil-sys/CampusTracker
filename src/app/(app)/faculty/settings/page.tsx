import type { Metadata } from "next";
import { FacultySettingsViewContent } from "@/components/faculty/faculty-settings-view";

export const metadata: Metadata = { title: "Faculty Console Settings — CampusTracker" };

export default function FacultySettingsPage() {
  return <FacultySettingsViewContent />;
}
