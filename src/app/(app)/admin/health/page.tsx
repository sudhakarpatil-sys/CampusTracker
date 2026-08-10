import type { Metadata } from "next";
import { HealthMonitorContent } from "@/components/admin/health-monitor";

export const metadata: Metadata = { title: "Connector Health & Diagnostics — CampusTracker Admin" };

export default function AdminHealthPage() {
  return <HealthMonitorContent />;
}
