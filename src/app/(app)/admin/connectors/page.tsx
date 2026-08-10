import type { Metadata } from "next";
import { ConnectorDashboardContent } from "@/components/admin/connector-dashboard";

export const metadata: Metadata = { title: "Academic Connector Console — CampusTracker" };

export default function AdminConnectorsPage() {
  return <ConnectorDashboardContent />;
}
