import type { Metadata } from "next";
import { AssignmentsHero } from "@/components/assignments/assignments-hero";
import { AssignmentsView } from "@/components/assignments/assignments-view";

export const metadata: Metadata = { title: "Assignments — CampusTracker" };

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <AssignmentsHero />
      <AssignmentsView />
    </div>
  );
}
