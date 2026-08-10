import type { Metadata } from "next";
import { AdminDashboardContent } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = { title: "Admin Console Overview — CampusTracker" };

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
