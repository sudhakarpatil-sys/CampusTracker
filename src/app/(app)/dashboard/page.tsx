import type { Metadata } from "next";
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

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* V3 Editorial Greeting Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between border-b border-border/40 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
            {firstName ? `Good to see you, ${firstName}` : "Dashboard"}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Your campus at a glance. Drag widgets to reorder.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-border/60 bg-muted/30 px-3 py-1 font-mono text-xs text-muted-foreground">
          {todayStr}
        </span>
      </div>

      <QuickActions />
      <DashboardGrid />
    </div>
  );
}
