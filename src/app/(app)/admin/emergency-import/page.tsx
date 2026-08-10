import type { Metadata } from "next";
import { EmergencyImportContent } from "@/components/admin/emergency-import-dialog";

export const metadata: Metadata = { title: "Emergency Recovery Import — CampusTracker Admin" };

export default function AdminEmergencyImportPage() {
  return <EmergencyImportContent />;
}
