import type { Metadata } from "next";
import { StudentResourcesContent } from "@/components/resources/student-resources";

export const metadata: Metadata = { title: "Course Resources — CampusTracker" };

export default function ResourcesPage() {
  return <StudentResourcesContent />;
}
