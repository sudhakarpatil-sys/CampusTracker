"use client";

import * as React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FacultySidebar } from "@/components/faculty/faculty-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

import { ErrorBoundary } from "@/components/shared/error-boundary";

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-background">
        {/* Skip to faculty content link */}
        <a
          href="#faculty-main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none"
        >
          Skip to faculty content
        </a>

        {/* Desktop Faculty Sidebar */}
        <aside
          role="navigation"
          aria-label="Faculty navigation"
          data-testid="faculty-sidebar-desktop"
          className={cn(
            "hidden shrink-0 border-r border-border/60 transition-all duration-200 lg:block",
            collapsed ? "w-[72px]" : "w-64"
          )}
        >
          <div className="sticky top-0 h-screen">
            <FacultySidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
          </div>
        </aside>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <FacultySidebar collapsed={false} onToggle={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Faculty Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />
          <main id="faculty-main-content" role="main" aria-label="Faculty Page Content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8" data-testid="faculty-main-content">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
