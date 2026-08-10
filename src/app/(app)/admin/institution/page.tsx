import type { Metadata } from "next";
import { InstitutionConfigContent } from "@/components/admin/institution-config";

export const metadata: Metadata = { title: "Institution Configuration — CampusTracker Admin" };

export default function AdminInstitutionPage() {
  return <InstitutionConfigContent />;
}
