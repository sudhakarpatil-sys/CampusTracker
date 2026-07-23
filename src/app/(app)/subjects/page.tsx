import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { SubjectsView } from "@/components/subjects/subjects-view";

export const metadata: Metadata = { title: "Subjects" };

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Subjects" description="The building blocks for your timetable, attendance, and assignments." />
      <SubjectsView />
    </div>
  );
}
