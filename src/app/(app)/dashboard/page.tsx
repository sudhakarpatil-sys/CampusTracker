import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { SmartStackCard } from "@/components/dashboard/smart-stack-card";

export const metadata: Metadata = { title: "Dashboard — CampusTracker" };

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
    : { data: null };

  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* V4 Premium Hero Banner */}
      <DashboardHero firstName={firstName} />

      {/* Interactive Metric Strip */}
      <DashboardMetrics />

      {/* Quick Action Bar */}
      <QuickActions />

      {/* Smart Stack — Event-Driven Priority Alerts */}
      <SmartStackCard />

      {/* Interactive Widget Grid */}
      <DashboardGrid />
    </div>
  );
}
