import type { Metadata } from "next";
import { FacultyMarksManagerContent } from "@/components/faculty/faculty-marks-manager";

export const metadata: Metadata = { title: "Mid-Sem & Internal Marks — Faculty Console" };

export default function FacultyMarksPage() {
  return <FacultyMarksManagerContent />;
}
