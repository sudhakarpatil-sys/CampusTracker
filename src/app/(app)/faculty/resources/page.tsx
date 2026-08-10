import type { Metadata } from "next";
import { FacultyResourcesManagerContent } from "@/components/faculty/faculty-resources-manager";

export const metadata: Metadata = { title: "Learning Resources Repository — CampusTracker Faculty" };

export default function FacultyResourcesPage() {
  return <FacultyResourcesManagerContent />;
}
