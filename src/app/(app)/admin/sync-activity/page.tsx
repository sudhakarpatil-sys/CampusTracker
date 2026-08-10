import type { Metadata } from "next";
import { SyncHistoryTableContent } from "@/components/admin/sync-history-table";

export const metadata: Metadata = { title: "Sync Activity Log — CampusTracker Admin" };

export default function AdminSyncActivityPage() {
  return <SyncHistoryTableContent />;
}
