import type { Metadata } from "next";
import { ExamsHero } from "@/components/exams/exams-hero";
import { ExamList } from "@/components/exams/exam-list";

export const metadata: Metadata = { title: "Exams — CampusTracker" };

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <ExamsHero />
      <ExamList />
    </div>
  );
}
