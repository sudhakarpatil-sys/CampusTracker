import type { Metadata } from "next";
import { EventsHero } from "@/components/events/events-hero";
import { EventList } from "@/components/events/event-list";

export const metadata: Metadata = { title: "Events — CampusTracker" };

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <EventsHero />
      <EventList />
    </div>
  );
}
