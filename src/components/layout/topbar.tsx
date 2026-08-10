"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { UserMenu } from "@/components/layout/user-menu";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SearchTrigger } from "@/components/search/search-trigger";

export function Topbar({ onOpenMobileSidebar }: { onOpenMobileSidebar: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border/80 bg-background/95 px-4 backdrop-blur-md shadow-xs sm:px-6" role="banner" data-testid="topbar">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMobileSidebar} aria-label="Open menu" data-testid="mobile-menu-button">
          <Menu className="h-4 w-4" />
        </Button>
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-1.5" data-testid="topbar-actions">
        <SearchTrigger />
        <ThemeToggle />
        <NotificationPanel />
        <UserMenu />
      </div>
    </header>
  );
}
