import type { Metadata } from "next";
import { DatasetConfigContent } from "@/components/admin/dataset-config";

export const metadata: Metadata = { title: "Academic Datasets Configuration — CampusTracker" };

export default function AdminDatasetsPage() {
  return <DatasetConfigContent />;
}
