import type { Metadata } from "next";
import { AdminSettingsContent } from "@/components/admin/admin-settings";

export const metadata: Metadata = { title: "Admin Console Settings — CampusTracker" };

export default function AdminSettingsPage() {
  return <AdminSettingsContent />;
}
