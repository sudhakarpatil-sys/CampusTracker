"use client";

import * as React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";
import { FeedbackButton } from "@/components/shared/feedback-button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Skip to content — visible only on keyboard focus (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>
      <aside
        role="navigation"
        aria-label="Main navigation"
        data-testid="sidebar-desktop"
        className={cn(
          "hidden shrink-0 border-r border-border/60 transition-all duration-200 lg:block",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div className="sticky top-0 h-screen">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main id="main-content" role="main" aria-label="Page content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8" data-testid="main-content">{children}</main>
      </div>

      <FeedbackButton />
    </div>
  );
}
