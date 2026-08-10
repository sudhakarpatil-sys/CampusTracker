import type { Metadata } from "next";
import { AuditLogsViewerContent } from "@/components/admin/audit-logs-viewer";

export const metadata: Metadata = { title: "Security & Audit Logs — CampusTracker Admin" };

export default function AdminAuditLogsPage() {
  return <AuditLogsViewerContent />;
}
