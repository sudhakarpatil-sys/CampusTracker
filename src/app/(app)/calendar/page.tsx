import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { UnifiedCalendar } from "@/components/calendar/unified-calendar";

export const metadata: Metadata = { title: "Calendar" };

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" description="Assignments, exams, and events on a single timeline." />
      <UnifiedCalendar />
    </div>
  );
}
