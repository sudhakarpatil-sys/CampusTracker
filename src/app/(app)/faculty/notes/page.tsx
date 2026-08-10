import type { Metadata } from "next";
import { FacultyNotesManagerContent } from "@/components/faculty/faculty-notes-manager";

export const metadata: Metadata = { title: "Notes & Study Materials — CampusTracker Faculty" };

export default function FacultyNotesPage() {
  return <FacultyNotesManagerContent />;
}
