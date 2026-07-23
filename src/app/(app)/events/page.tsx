import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EventList } from "@/components/events/event-list";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Events" description="College events, workshops, hackathons, club activities, and personal reminders." />
      <EventList />
    </div>
  );
}
