import type { Metadata } from "next";
import { NotificationsForm } from "@/components/settings/notifications-form";

export const metadata: Metadata = { title: "Notification settings" };

export default function NotificationsSettingsPage() {
  return <NotificationsForm />;
}
