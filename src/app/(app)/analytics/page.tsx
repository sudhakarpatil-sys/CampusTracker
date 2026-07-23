import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { ComingSoonPage } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <ComingSoonPage
      title="Analytics"
      description="Study patterns and productivity trends over the semester."
      icon={BarChart3}
      previewNote="Charts covering attendance trends, study time, and goal completion are planned for Phase 2."
    />
  );
}
