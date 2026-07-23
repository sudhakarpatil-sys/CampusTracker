"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, NotebookPen } from "lucide-react";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className={cn("flex h-16 items-center gap-2 border-b border-border/60 px-4", collapsed && "justify-center px-0")}>
        <Link href="/dashboard" className="flex items-center gap-2 font-display text-base font-semibold" onClick={onNavigate}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <NotebookPen className="h-4 w-4" />
          </span>
          {!collapsed && APP_NAME}
        </Link>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href as never}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-accent/15 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <span className="flex flex-1 items-center justify-between">
                  {item.label}
                  {item.comingSoon && (
                    <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-[10px]">
                      Soon
                    </Badge>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={onToggle}
        className="flex items-center gap-2 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        {!collapsed && "Collapse"}
      </button>
    </div>
  );
}
