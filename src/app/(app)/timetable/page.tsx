import type { Metadata } from "next";
import { TimetableHero } from "@/components/timetable/timetable-hero";
import { TimetableGrid } from "@/components/timetable/timetable-grid";

export const metadata: Metadata = { title: "Timetable — CampusTracker" };

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <TimetableHero />
      <TimetableGrid />
    </div>
  );
}
