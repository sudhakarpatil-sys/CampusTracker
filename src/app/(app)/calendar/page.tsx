import type { Metadata } from "next";
import { CalendarHero } from "@/components/calendar/calendar-hero";
import { UnifiedCalendar } from "@/components/calendar/unified-calendar";

export const metadata: Metadata = { title: "Calendar — CampusTracker" };

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <CalendarHero />
      <UnifiedCalendar />
    </div>
  );
}
