import type { Metadata } from "next";
import { FacultyProfileViewContent } from "@/components/faculty/faculty-profile-view";

export const metadata: Metadata = { title: "Faculty Profile — CampusTracker" };

export default function FacultyProfilePage() {
  return <FacultyProfileViewContent />;
}
