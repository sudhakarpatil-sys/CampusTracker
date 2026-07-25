import type { Metadata } from "next";
import { ImportWizard } from "@/components/timetable-import/import-wizard";

export const metadata: Metadata = { title: "Import timetable" };

export default function TimetableImportPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-10">
      <ImportWizard />
    </div>
  );
}
