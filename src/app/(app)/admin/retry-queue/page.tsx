import type { Metadata } from "next";
import { RetryQueueViewerContent } from "@/components/admin/retry-queue-viewer";

export const metadata: Metadata = { title: "Sync Retry Queue — CampusTracker Admin" };

export default function AdminRetryQueuePage() {
  return <RetryQueueViewerContent />;
}
