import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ExamList } from "@/components/exams/exam-list";

export const metadata: Metadata = { title: "Exams" };

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Exams" description="Countdown to every exam, with prep status tracked alongside." />
      <ExamList />
    </div>
  );
}
