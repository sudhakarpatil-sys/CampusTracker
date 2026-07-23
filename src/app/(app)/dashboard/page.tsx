import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

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
    <div className="space-y-8">
      <PageHeader
        title={firstName ? `Good to see you, ${firstName}` : "Dashboard"}
        description="Drag widgets to reorder them, or hide the ones you don't need yet."
      />
      <QuickActions />
      <DashboardGrid />
    </div>
  );
}
