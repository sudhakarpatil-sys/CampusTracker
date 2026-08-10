import type { Metadata } from "next";
import { AnnouncementsHero } from "@/components/announcements/announcements-hero";
import { AnnouncementsList } from "@/components/announcements/announcements-list";

export const metadata: Metadata = { title: "Announcements — CampusTracker" };

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <AnnouncementsHero />
      <AnnouncementsList />
    </div>
  );
}
