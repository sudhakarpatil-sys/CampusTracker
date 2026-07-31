import type { Metadata } from "next";
import { SubjectsHero } from "@/components/subjects/subjects-hero";
import { SubjectsView } from "@/components/subjects/subjects-view";

export const metadata: Metadata = { title: "Subjects — CampusTracker" };

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <SubjectsHero />
      <SubjectsView />
    </div>
  );
}
