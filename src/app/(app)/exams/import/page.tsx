import type { Metadata } from "next";
import { ExamImportWizard } from "@/components/exam-import/exam-import-wizard";

export const metadata: Metadata = { title: "Import exam schedule — CampusTracker" };

export default function ExamImportPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
      <ExamImportWizard />
    </div>
  );
}
